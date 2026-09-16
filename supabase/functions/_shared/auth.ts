import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

/**
 * Shared authorization helpers for edge functions.
 *
 * Several functions run with the SERVICE_ROLE key and were previously callable
 * by anyone (verify_jwt=false, no internal check). These helpers add an explicit
 * gate so only the intended caller can invoke them.
 */

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

function bearer(req: Request): string | null {
  const header = req.headers.get('Authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/**
 * Allow only internal / service-to-service calls. An edge function that invokes
 * this one through a service-role Supabase client forwards the service-role key
 * as the bearer token; a cron trigger can send the same key. Anonymous public
 * callers (who only have the anon key) are rejected.
 */
export function assertServiceRole(req: Request): void {
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const token = bearer(req);
  if (!serviceKey || !token || token !== serviceKey) {
    throw new AuthError('Forbidden: service-role authorization required', 403);
  }
}

/**
 * Require an authenticated user that has the `admin` role. Used by endpoints
 * that are triggered from the admin UI (which forwards the user's JWT).
 * A valid service-role token is also accepted so cron/automation can run it.
 */
export async function assertAdmin(req: Request): Promise<void> {
  const token = bearer(req);
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (token && serviceKey && token === serviceKey) return; // internal/cron

  if (!token) throw new AuthError('Unauthorized: missing token');

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new AuthError('Unauthorized: invalid session');

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (!role) throw new AuthError('Forbidden: admin role required', 403);
}

/** Build a JSON 401/403 Response from an AuthError, with CORS headers. */
export function authErrorResponse(err: unknown, corsHeaders: Record<string, string>): Response | null {
  if (err instanceof AuthError) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: err.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  return null;
}

/**
 * Кто вызывает функцию: служебный ключ, вошедший пользователь или гость.
 *
 * Функции обработки аудита ходят в базу служебным ключом, то есть RLS их не
 * ограничивает. Без такой проверки любой желающий мог подставить чужой
 * `task_id` и получить или переписать чужой аудит.
 */
export async function resolveCaller(
  req: Request,
): Promise<{ userId: string | null; isService: boolean }> {
  const token = bearer(req);
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (token && serviceKey && token === serviceKey) return { userId: null, isService: true };
  if (!token) return { userId: null, isService: false };

  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  // Ключ anon приходит в заголовке и у неавторизованных вызовов — это не вход.
  if (token === anonKey) return { userId: null, isService: false };

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', anonKey);
  const { data: { user } } = await supabase.auth.getUser(token);
  return { userId: user?.id ?? null, isService: false };
}

/**
 * Доступ к задаче аудита.
 *
 * Задача без хозяина — гостевой аудит: её идентификатор знает только тот, кто
 * её запустил, поэтому доступ открыт. У задачи с хозяином работать может он
 * сам, администратор или служебный вызов.
 */
export async function assertTaskAccess(req: Request, taskId: string): Promise<string | null> {
  const { userId, isService } = await resolveCaller(req);
  if (isService) return null;

  const admin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { data: task } = await admin
    .from('audit_tasks')
    .select('user_id')
    .eq('id', taskId)
    .maybeSingle();

  if (!task) throw new AuthError('Задача аудита не найдена', 404);
  if (task.user_id === null) return userId;
  if (task.user_id === userId) return userId;

  if (userId) {
    const { data: role } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    if (role) return userId;
  }

  throw new AuthError('Доступ к чужой задаче аудита запрещён', 403);
}

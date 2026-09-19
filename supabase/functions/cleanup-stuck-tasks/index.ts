import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { assertServiceRole, authErrorResponse } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Internal maintenance job: service-role / cron only.
  try {
    assertServiceRole(req);
  } catch (err) {
    const resp = authErrorResponse(err, corsHeaders);
    if (resp) return resp;
    throw err;
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🧹 Starting cleanup of stuck tasks...');

    // Логика уборки живёт в базе (функция fail_stuck_audit_tasks, её же зовёт
    // расписание). Здесь раньше была своя копия: она видела только статус
    // 'processing' и не трогала запись в audits — возобновлённый и снова
    // зависший аудит навсегда оставался «сканируется».
    const { data: cleaned, error: cleanupError } = await supabase.rpc('fail_stuck_audit_tasks');

    if (cleanupError) {
      console.error('❌ Error cleaning up stuck tasks:', cleanupError);
      throw cleanupError;
    }

    const count = typeof cleaned === 'number' ? cleaned : 0;
    console.log(`✅ Cleaned up ${count} stuck tasks`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: count > 0 ? `Cleaned up ${count} stuck tasks` : 'No stuck tasks found',
        cleaned: count
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

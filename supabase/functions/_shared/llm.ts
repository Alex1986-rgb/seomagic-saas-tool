/**
 * Слой языковой модели для edge-функций.
 *
 * Функциям нужен один и тот же ответ — связный текст по запросу, — а поставщик
 * может меняться. Поэтому здесь единственная точка входа `generateText`, а всё
 * различие провайдеров спрятано внутри.
 *
 * Поставщик выбирается переменной LLM_PROVIDER:
 *   deepseek  — DEEPSEEK_API_KEY, модель DEEPSEEK_MODEL (по умолчанию deepseek-flash)
 *   anthropic — ANTHROPIC_API_KEY, модель ANTHROPIC_MODEL
 *
 * Если переменная не задана, берётся тот поставщик, чей ключ прописан.
 */

export type LlmProvider = 'deepseek' | 'anthropic';

export interface GenerateRequest {
  /** Роль модели: чего от неё ждут. */
  system: string;
  /** Сам запрос. */
  prompt: string;
  maxTokens?: number;
  /** 0 — предсказуемо, 1 — свободно. Для SEO-текстов нужна умеренность. */
  temperature?: number;
}

export interface TokenUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

export interface GenerateResult {
  text: string;
  provider: LlmProvider;
  model: string;
  /** Расход токенов, как его сообщила модель: по нему считается стоимость. */
  usage?: TokenUsage;
}

/** Поставщик не настроен или ответил отказом — отличаем от прочих сбоев. */
export class LlmError extends Error {
  constructor(message: string, readonly status = 502) {
    super(message);
    this.name = 'LlmError';
  }
}

export const LLM_SETUP_HINT =
  'Языковая модель не настроена: нет ключа поставщика. Пропишите в секретах проекта ' +
  'DEEPSEEK_API_KEY либо ANTHROPIC_API_KEY.';

const DEFAULT_MODELS: Record<LlmProvider, string> = {
  deepseek: 'deepseek-flash',
  anthropic: 'claude-opus-4-8',
};

export function getConfiguredProvider(): LlmProvider | null {
  const explicit = Deno.env.get('LLM_PROVIDER')?.trim().toLowerCase();
  const available: LlmProvider[] = [];
  if (Deno.env.get('DEEPSEEK_API_KEY')) available.push('deepseek');
  if (Deno.env.get('ANTHROPIC_API_KEY')) available.push('anthropic');

  if (explicit === 'deepseek' || explicit === 'anthropic') {
    return available.includes(explicit) ? explicit : null;
  }
  return available[0] ?? null;
}

export function getModel(provider: LlmProvider): string {
  const override = provider === 'deepseek'
    ? Deno.env.get('DEEPSEEK_MODEL')
    : Deno.env.get('ANTHROPIC_MODEL');
  return override?.trim() || DEFAULT_MODELS[provider];
}

export async function generateText(req: GenerateRequest): Promise<GenerateResult> {
  const provider = getConfiguredProvider();
  if (!provider) throw new LlmError(LLM_SETUP_HINT, 503);

  return provider === 'deepseek' ? await callDeepSeek(req) : await callAnthropic(req);
}

// --- DeepSeek (совместим с интерфейсом OpenAI) --------------------------------

async function callDeepSeek(
  { system, prompt, maxTokens = 4096, temperature = 0.3 }: GenerateRequest,
): Promise<GenerateResult> {
  const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
  if (!apiKey) throw new LlmError(LLM_SETUP_HINT, 503);
  const model = getModel('deepseek');

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new LlmError(`DeepSeek ответил ${res.status}: ${detail.slice(0, 200)}`, 502);
  }

  const body = await res.json();
  const text = textFromOpenAiStyle(body);
  if (!text) throw new LlmError('DeepSeek вернул пустой ответ', 502);

  return { text, provider: 'deepseek', model, usage: usageFromOpenAiStyle(body) };
}

/**
 * Текст из ответа в формате OpenAI.
 *
 * У рассуждающих моделей рядом с ответом лежит ход мыслей (`reasoning_content`) —
 * он не предназначен для пользователя, поэтому берём только `content`.
 */
export function textFromOpenAiStyle(body: unknown): string {
  const choices = (body as { choices?: unknown[] })?.choices;
  if (!Array.isArray(choices) || choices.length === 0) return '';

  const message = (choices[0] as { message?: { content?: unknown } })?.message;
  const content = message?.content;

  if (typeof content === 'string') return content.trim();

  // Некоторые совместимые API отдают content массивом частей.
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : (part as { text?: string })?.text ?? ''))
      .join('')
      .trim();
  }
  return '';
}

// --- Anthropic ----------------------------------------------------------------

async function callAnthropic(
  { system, prompt, maxTokens = 4096, temperature }: GenerateRequest,
): Promise<GenerateResult> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new LlmError(LLM_SETUP_HINT, 503);
  const model = getModel('anthropic');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      ...(temperature === undefined ? {} : { temperature }),
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new LlmError(`Anthropic ответил ${res.status}: ${detail.slice(0, 200)}`, 502);
  }

  const body = await res.json();
  const text = textFromAnthropic(body);
  if (!text) throw new LlmError('Anthropic вернул пустой ответ', 502);

  return { text, provider: 'anthropic', model, usage: usageFromAnthropic(body) };
}

/** Текст из ответа Anthropic: блоки размышлений пропускаем, берём текстовые. */
export function textFromAnthropic(body: unknown): string {
  const content = (body as { content?: unknown[] })?.content;
  if (!Array.isArray(content)) return '';

  return content
    .filter((block) => (block as { type?: string })?.type === 'text')
    .map((block) => (block as { text?: string }).text ?? '')
    .join('')
    .trim();
}

/** Расход токенов из ответа в формате OpenAI. */
export function usageFromOpenAiStyle(body: unknown): TokenUsage | undefined {
  const usage = (body as { usage?: Record<string, unknown> })?.usage;
  if (!usage) return undefined;
  return {
    prompt_tokens: Number(usage.prompt_tokens ?? 0),
    completion_tokens: Number(usage.completion_tokens ?? 0),
    total_tokens: Number(usage.total_tokens ?? 0),
  };
}

/** Расход токенов из ответа Anthropic: там свои названия полей. */
export function usageFromAnthropic(body: unknown): TokenUsage | undefined {
  const usage = (body as { usage?: Record<string, unknown> })?.usage;
  if (!usage) return undefined;
  const prompt = Number(usage.input_tokens ?? 0);
  const completion = Number(usage.output_tokens ?? 0);
  return { prompt_tokens: prompt, completion_tokens: completion, total_tokens: prompt + completion };
}

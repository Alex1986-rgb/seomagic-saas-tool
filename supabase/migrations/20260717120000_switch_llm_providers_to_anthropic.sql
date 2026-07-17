-- Edge functions now call the Anthropic API directly; keep the providers registry in sync
UPDATE public.llm_providers
SET provider_name = 'Anthropic',
    model_name = 'claude-opus-4-8',
    api_config = '{"max_tokens": 4096}'
WHERE provider_name = 'Lovable AI';

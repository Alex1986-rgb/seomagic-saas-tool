// Shared Anthropic (Claude) client for edge functions.
// Requires the ANTHROPIC_API_KEY secret; model can be overridden via ANTHROPIC_MODEL.
import Anthropic from "npm:@anthropic-ai/sdk";

export const ANTHROPIC_MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-opus-4-8";

export function anthropicClient(): Anthropic {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  return new Anthropic({ apiKey });
}

// Claude responses may contain thinking blocks before the text — collect text blocks only.
export function textFromMessage(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

export { Anthropic };

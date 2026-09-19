import { describe, expect, it } from 'vitest';
import { textFromAnthropic, textFromOpenAiStyle } from './llm.ts';

describe('textFromOpenAiStyle (DeepSeek и совместимые)', () => {
  it('берёт содержимое ответа', () => {
    const body = { choices: [{ message: { role: 'assistant', content: '  Готовый текст  ' } }] };
    expect(textFromOpenAiStyle(body)).toBe('Готовый текст');
  });

  it('не отдаёт ход рассуждений вместо ответа', () => {
    const body = {
      choices: [{
        message: {
          role: 'assistant',
          reasoning_content: 'Сначала подумаю, какой заголовок лучше...',
          content: 'Редукторы червячные — купить с доставкой',
        },
      }],
    };
    expect(textFromOpenAiStyle(body)).toBe('Редукторы червячные — купить с доставкой');
  });

  it('собирает ответ, разбитый на части', () => {
    const body = { choices: [{ message: { content: [{ text: 'Первая часть. ' }, { text: 'Вторая.' }] } }] };
    expect(textFromOpenAiStyle(body)).toBe('Первая часть. Вторая.');
  });

  it('возвращает пустую строку на ответе без выбора', () => {
    expect(textFromOpenAiStyle({ choices: [] })).toBe('');
    expect(textFromOpenAiStyle({})).toBe('');
    expect(textFromOpenAiStyle(null)).toBe('');
  });
});

describe('textFromAnthropic', () => {
  it('берёт текстовые блоки, пропуская размышления', () => {
    const body = {
      content: [
        { type: 'thinking', thinking: 'внутренние рассуждения' },
        { type: 'text', text: 'Ответ пользователю' },
      ],
    };
    expect(textFromAnthropic(body)).toBe('Ответ пользователю');
  });

  it('склеивает несколько текстовых блоков', () => {
    const body = { content: [{ type: 'text', text: 'Раз. ' }, { type: 'text', text: 'Два.' }] };
    expect(textFromAnthropic(body)).toBe('Раз. Два.');
  });

  it('возвращает пустую строку, когда текста нет', () => {
    expect(textFromAnthropic({ content: [{ type: 'thinking', thinking: 'только мысли' }] })).toBe('');
    expect(textFromAnthropic({})).toBe('');
  });
});

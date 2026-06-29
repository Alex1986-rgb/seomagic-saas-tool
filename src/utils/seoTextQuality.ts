/**
 * Анализ качества SEO-текста: тошнота, водность, заспамленность, ключевые слова.
 * Метрики приближены к стандартам Advego / Text.ru. Чистые функции (без зависимостей).
 */

// Базовый список русских стоп-слов (для оценки водности).
const STOP_WORDS = new Set([
  'и', 'в', 'во', 'не', 'что', 'он', 'на', 'я', 'с', 'со', 'как', 'а', 'то', 'все', 'она',
  'так', 'его', 'но', 'да', 'ты', 'к', 'у', 'же', 'вы', 'за', 'бы', 'по', 'только', 'ее',
  'мне', 'было', 'вот', 'от', 'меня', 'еще', 'нет', 'о', 'из', 'ему', 'теперь', 'когда',
  'даже', 'ну', 'вдруг', 'ли', 'если', 'уже', 'или', 'ни', 'быть', 'был', 'него', 'до',
  'вас', 'нибудь', 'опять', 'уж', 'вам', 'ведь', 'там', 'потом', 'себя', 'ничего', 'ей',
  'может', 'они', 'тут', 'где', 'есть', 'надо', 'ней', 'для', 'мы', 'тебя', 'их', 'чем',
  'была', 'сам', 'чтоб', 'без', 'будто', 'чего', 'раз', 'тоже', 'себе', 'под', 'будет',
  'ж', 'тогда', 'кто', 'этот', 'того', 'потому', 'этого', 'какой', 'совсем', 'ним', 'этом',
  'один', 'почти', 'мой', 'тем', 'чтобы', 'нее', 'кажется', 'сейчас', 'были', 'куда', 'зачем',
  'всех', 'никогда', 'можно', 'при', 'наконец', 'два', 'об', 'другой', 'хоть', 'после',
  'над', 'больше', 'тот', 'через', 'эти', 'нас', 'про', 'всего', 'них', 'какая', 'много',
  'разве', 'эту', 'моя', 'свою', 'этой', 'перед', 'лучше', 'чуть', 'том', 'нельзя', 'такой',
  'им', 'более', 'всегда', 'конечно', 'всю', 'между', 'это', 'эта', 'все', 'свой', 'наш',
]);

export interface TextQuality {
  chars: number;          // символов без пробелов
  charsTotal: number;     // символов всего
  words: number;          // всего слов
  uniqueWords: number;    // уникальных слов
  classicNausea: number;  // классическая тошнота = √(частота самого частого слова)
  academicNausea: number; // академическая тошнота, % (доля повторов значимых слов)
  waterPercent: number;   // водность, % (доля стоп-слов)
  spamScore: number;      // заспамленность, % (плотность топ-слова)
  topKeywords: { word: string; count: number; density: number }[];
  warnings: string[];     // предупреждения по нормам
}

const norm = (w: string) => w.toLowerCase().replace(/ё/g, 'е');

export function analyzeText(input: string): TextQuality {
  const text = String(input || '');
  const charsTotal = text.length;
  const chars = text.replace(/\s/g, '').length;
  const tokens = (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).map(norm);
  const words = tokens.length || 1;

  const freq: Record<string, number> = {};
  let significant = 0;
  let repeatsSignificant = 0;
  let stop = 0;
  for (const t of tokens) {
    if (STOP_WORDS.has(t)) { stop++; continue; }
    if (t.length < 3) continue;
    freq[t] = (freq[t] || 0) + 1;
    significant++;
  }
  for (const w in freq) if (freq[w] > 1) repeatsSignificant += freq[w];

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const maxFreq = sorted.length ? sorted[0][1] : 0;

  const classicNausea = Math.round(Math.sqrt(maxFreq) * 10) / 10;
  const academicNausea = significant ? Math.round((repeatsSignificant / significant) * 1000) / 10 : 0;
  const waterPercent = Math.round((stop / words) * 1000) / 10;
  const spamScore = significant ? Math.round((maxFreq / significant) * 1000) / 10 : 0;

  const topKeywords = sorted.slice(0, 10).map(([word, count]) => ({
    word, count, density: Math.round((count / words) * 1000) / 10,
  }));

  // Нормы (ориентир Text.ru/Advego): тошнота ≤ ~7–8, водность 15–55%, спам ≤ 60%.
  const warnings: string[] = [];
  if (classicNausea > 7) warnings.push(`Высокая классическая тошнота (${classicNausea}) — снизьте повторы ключевого слова`);
  if (academicNausea > 9) warnings.push(`Высокая академическая тошнота (${academicNausea}%)`);
  if (waterPercent > 60) warnings.push(`Высокая водность (${waterPercent}%) — много «воды»`);
  if (waterPercent < 10) warnings.push(`Слишком низкая водность (${waterPercent}%) — текст может выглядеть неестественно`);
  if (spamScore > 60) warnings.push(`Заспамленность (${spamScore}%) — переоптимизация`);

  return {
    chars, charsTotal, words, uniqueWords: Object.keys(freq).length,
    classicNausea, academicNausea, waterPercent, spamScore, topKeywords, warnings,
  };
}

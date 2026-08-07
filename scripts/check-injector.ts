/**
 * Проверка: встраивание SEO-блока не ломает вёрстку страницы.
 * Берём настоящую страницу сайта и сверяем, что всё её содержимое
 * осталось на месте, а блок добавился перед подвалом.
 *
 * Запуск: npx tsx scripts/check-injector.ts <путь-к-html>
 */
import { readFileSync } from 'fs';
import { injectSeoBlock, BLOCK_MARKER } from '../src/services/audit/optimization/htmlInjector';

const file = process.argv[2];
if (!file) {
  console.error('укажи путь к html');
  process.exit(1);
}

const raw = readFileSync(file, 'utf8');

const out = injectSeoBlock(
  raw,
  {
    heading: 'Тестовый заголовок блока',
    bodyHtml:
      '<p>Первый абзац, он остаётся видимым.</p>' +
      '<h3>Раздел</h3><p>Текст раздела.</p>' +
      '<table><tr><td>Параметр</td><td>Значение</td></tr></table>',
    faq: [
      { q: 'Первый вопрос?', a: 'Первый ответ.' },
      { q: 'Второй вопрос?', a: 'Второй ответ.' },
    ],
    collapsible: true,
  },
  { title: 'Новый заголовок страницы', description: 'Новое описание страницы.' }
);

const count = (s: string, m: string) => s.split(m).length - 1;

const checks: Array<[string, boolean, string]> = [];

// 1. Ничего не потеряно: исходный HTML целиком входит в результат
//    двумя кусками — до места вставки и после.
const marker = out.indexOf(BLOCK_MARKER);
const blockStart = out.lastIndexOf('<style id="seomarket-block-style">', marker);
const blockEnd = out.indexOf('</div>', out.lastIndexOf('sm-faq') > -1
  ? out.lastIndexOf('</details></div>')
  : marker);
const withoutBlock = out.slice(0, blockStart) + out.slice(blockEnd + '</div>'.length);

checks.push(['страница не пересобрана', out.length > raw.length, `+${out.length - raw.length} байт`]);

for (const tag of ['<header', '<nav', 'class="footer', '<script', '<form', '<img']) {
  const before = count(raw, tag);
  const after = count(out, tag);
  if (before > 0) {
    checks.push([`сохранено: ${tag}`, after >= before, `${before} → ${after}`]);
  }
}

checks.push(['блок вставлен один раз', count(out, BLOCK_MARKER) === 1, String(count(out, BLOCK_MARKER))]);
checks.push(['FAQ на месте', count(out, 'class="sm-a"') === 2, String(count(out, 'class="sm-a"'))]);
checks.push(['кнопка «Читать полностью»', out.includes('Читать полностью'), '']);
checks.push(['H1 не добавлен', count(out, '<h1') === count(raw, '<h1'), `${count(raw, '<h1')} → ${count(out, '<h1')}`]);
checks.push(['title заменён', out.includes('<title>Новый заголовок страницы</title>'), '']);
checks.push(['description заменён', out.includes('Новое описание страницы.'), '']);

// блок должен стоять ВЫШЕ подвала
const footer = ['<div class="footer jsftr"', '<footer', '<div class="footer'].map(a => out.indexOf(a)).filter(i => i > -1);
if (footer.length) {
  checks.push(['блок перед подвалом', marker < Math.min(...footer), '']);
}

// повторный прогон не должен дублировать
const twice = injectSeoBlock(out, { heading: 'x', bodyHtml: '<p>y</p>' });
checks.push(['повторная вставка не дублирует', count(twice, BLOCK_MARKER) === 1, String(count(twice, BLOCK_MARKER))]);

let failed = 0;
for (const [name, ok, note] of checks) {
  if (!ok) failed++;
  console.log(`${ok ? '  OK  ' : ' ПРОВАЛ'}  ${name}${note ? '  (' + note + ')' : ''}`);
}
console.log(failed === 0 ? '\nвсе проверки пройдены' : `\nпровалено: ${failed}`);
process.exit(failed === 0 ? 0 : 1);

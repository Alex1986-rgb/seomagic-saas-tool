# Промты для генерации фото макета SeoMarket

Дополняет `photo-plan.md`: там задание на съёмку, здесь готовые промты на **все** рамки `<image-slot>`.
Сейчас рамки заполнены бесплатными снимками Unsplash (`photos/stock.json`, автор подписан в рамке).
Когда появится баланс генератора, кадры заменяются по этому файлу — id те же.

## Чем генерировать

- router.cheap, модель `gpt-image-2`: `python3 ~/projects/router-gen/rgen.py image "<СТИЛЬ> Subject: <сюжет>" --size <размер> --out photos/_raw/<id>.png`.
  На 16.09.2026 баланс $0,06 — не хватает даже на один кадр (нужно ~$0,50).
- Higgsfield (коннектор): `gpt_image_2_5` или `nano_banana_pro`, 1 кредит за кадр; на 16.09.2026 кредитов 0.
- После генерации: `sips -Z 1600 -s format jpeg -s formatOptions 78 photos/_raw/<id>.png --out photos/<id>.jpg`,
  затем в HTML у рамки `src="photos/<id>.jpg"` и убрать `credit`/`credit-href`.

## Размеры

| Формат рамки | gpt-image-2 `--size` | Higgsfield `aspect_ratio` |
| --- | --- | --- |
| 16:9, 16:10, 3:2, 4:3 | 1536x1024 | 16:9 / 3:2 / 4:3 |
| 4:5 | 1024x1536 | 4:5 (или 3:4) |
| 1:1 | 1024x1024 | 1:1 |

Рамка кадрирует по `fit="cover"`, поэтому 1536×1024 годится для всех горизонтальных форматов.

## Строка стиля — добавлять к каждому промту

```
editorial still life photograph, 35mm lens, matte muted palette, single soft directional light
from the left, deep shadows, shallow depth of field, fine film grain across the whole frame,
desaturated, high local contrast and clear geometry (the image will be duotoned), new but not
sterile objects. No people, no faces, no hands unless stated, no readable text, no logos,
no arrows or overlay charts, no watermark. Avoid CGI look: not octane, not keyshot, not blender render.
```

Экранные кадры (`*-b` в блоге, `rev-*b`): добавлять
`screen shot at an angle, moiré-free, interface blurred and unreadable, only shapes of tables and bars`.
Читаемый текст генераторы рисуют с ошибками — на дуотоне это сразу видно.

## Что не генерировать

- **Портреты к отзывам (`rev-*a`)** — выдуманное лицо под именем клиента и номером заказа является подлогом.
  Промты ниже дают обстановку без человека; настоящий портрет ставится только с согласия клиента.
- **`redesign-before` / `redesign-after`** — только настоящие скриншоты (сейчас: текущий сайт на Pages и сам макет).
- **`article-lcp-chart` / `article-before-after`** — схемы, а не «замеры»: цифры на иллюстрации без реального
  замера выдумывают результат. Сейчас в рамках SVG-схемы с подписью «Схема».

## Промты

| id | Размер | Сюжет (Subject) |
| --- | --- | --- |
| `blog-hero-1a` | 1536x1024 | overhead view of an SEO specialist desk: open laptop with a blurred audit report, printed site structure diagram, a black marker, a coffee cup at the edge |
| `blog-hero-1b` | 1024x1536 | macro of a monitor showing a web vitals chart, one horizontal bar far longer than the others, shot at a steep angle, interface unreadable |
| `blog-2a` | 1536x1024 | ten identical printed A4 sheets fanned out on a dark wooden table, the top sheet marked with a single pen stroke |
| `blog-2b` | 1024x1024 | extreme macro of a browser address bar on a screen, long URL with query parameters dissolving into bokeh, unreadable |
| `blog-3a` | 1536x1024 | printed page of text on a desk, one short phrase highlighted with yellow marker nine times down the page, desaturated |
| `blog-3b` | 1024x1024 | small brass apothecary balance scales standing on a sheet of printed text |
| `blog-4a` | 1536x1024 | steel pins on tracing paper connected by thin black thread, five threads radiating from one central pin |
| `blog-4b` | 1024x1024 | hand holding a ruling pen drawing a straight line across a site structure blueprint, only the hand and tool |
| `blog-5a` | 1536x1024 | broken steel chain lying on dark brushed metal, two links pulled apart, hard side light |
| `blog-5b` | 1024x1024 | macro of a monitor with a mostly empty error page, large blurred numerals, dark room |
| `blog-6a` | 1536x1024 | open notebook with a handwritten content outline in pencil, a steel ruler laid across, top view |
| `blog-6b` | 1024x1024 | macro of a printed specification table header, grid lines sharp, text out of focus |
| `blog-7a` | 1536x1024 | a brass postal stamp and its fresh ink impression on thick cream paper |
| `blog-7b` | 1024x1024 | macro of a screen with a long vertical list of URLs in a queue, blurred, one row highlighted |
| `blog-8a` | 1536x1024 | metal letterpress type sorted in a wooden compositor case, close overhead view |
| `blog-8b` | 1024x1024 | smartphone lying on a desk showing a blurred search results page with star rating shapes |
| `blog-9a` | 1536x1024 | set of inspection tools laid in a row on a workbench: vernier caliper, try square, feeler gauges |
| `blog-9b` | 1024x1024 | close-up of a printed estimate sheet with rows of figures and a total line, figures out of focus |
| `blog-10a` | 1536x1024 | closed wooden door with a blank metal plate and a shut steel bolt, hard side light |
| `blog-10b` | 1024x1024 | macro of a plain text file on a dark code editor, a single line in focus, characters unreadable |
| `blog-11a` | 1536x1024 | balance scales, a thick stack of invoices on one pan, a single sheet on the other pan |
| `blog-11b` | 1024x1024 | desk calculator next to a printed estimate sheet and a pencil, overhead |
| `rail-1` | 1536x1024 | closed door with a blank metal plate and a sliding latch, close crop, side light |
| `rail-2` | 1536x1024 | identical paper copies laid out in a strict grid on a dark table, top view |
| `rail-3` | 1536x1024 | macro of printed text with several repeated words highlighted by marker |
| `rail-4` | 1536x1024 | pins and taut threads on a technical diagram forming a network graph, shot from the side |
| `rail-5` | 1536x1024 | mechanical stopwatch beside a keyboard, long exposure blur on the second hand, contrasty light |
| `rail-6` | 1536x1024 | open notebook with a handwritten outline and a ruler on top, top view |
| `rev-1a` | 1024x1536 | empty furniture showroom, a sofa under window light, no people |
| `rev-1b` | 1536x1024 | office monitor showing a blurred furniture catalog grid, shot at an angle |
| `rev-2a` | 1024x1536 | empty desk with two monitors glowing in the evening, chair pushed back, no people |
| `rev-2b` | 1536x1024 | printed estimate with several rows ticked and a pen lying on top, overhead |
| `rev-3a` | 1024x1536 | empty meeting room, light background, long table, chairs tucked in |
| `rev-3b` | 1536x1024 | signed paper document and a closed folder on a table, close crop, signature illegible |
| `rev-4a` | 1024x1536 | laptop with a dark code editor in a dim room, hard light from a desk lamp, no people |
| `rev-4b` | 1536x1024 | macro of a code editor on a screen at an angle, syntax colors desaturated, unreadable |
| `rev-5a` | 1024x1536 | empty dental clinic treatment room, calm white light, no people |
| `rev-5b` | 1536x1024 | smartphone lying on a clinic reception desk showing a blurred services page |
| `rev-6a` | 1024x1536 | empty industrial workshop with machine tools, overhead lamps, no people |
| `rev-6b` | 1536x1024 | screen with a table of rankings and a thin vertical marker line on a chart, blurred |

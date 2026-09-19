/**
 * Фото публичного сайта — бесплатные снимки Unsplash (Unsplash License), подобраны под сюжеты
 * фотоплана макета (design/seomarket-v2/photo-plan.md). Ключ = id рамки в макете.
 *
 * Подпись автора обязательна по условиям Unsplash и выводится компонентом SitePhoto.
 * Замена на собственную генерацию — промты в design/seomarket-v2/photo-prompts.md: положить файл
 * в public/images/site/<id>.jpg и указать src: '/images/site/<id>.jpg' без credit.
 */

export interface SitePhotoSource {
  src: string;
  /** Подпись «Photo by … on Unsplash»; для своих фото — не задаётся. */
  credit?: string;
  creditHref?: string;
  /** Что в кадре — идёт в alt, если страница не дала свой. */
  alt: string;
}

export const PHOTOS: Record<string, SitePhotoSource> = {
  "rail-1": { src: "https://images.unsplash.com/photo-1679999466911-6e83bf4f076d?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Gowtham AGM on Unsplash", creditHref: "https://unsplash.com/@gowthamagm", alt: "Старая дверь с ржавым замком/засовом; металлической таблички нет" },
  "rail-2": { src: "https://images.unsplash.com/photo-1729710877235-28d1e82d0442?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Kelly Sikkema on Unsplash", creditHref: "https://unsplash.com/@kellysikkema", alt: "Белые карточки-листы рядами на чёрном столе, карандаш" },
  "rail-3": { src: "https://images.unsplash.com/photo-1752578753798-ff3a23e16498?w=1600&q=80&auto=format&fit=crop", credit: "Photo by sara sanchez sabogal on Unsplash", creditHref: "https://unsplash.com/@sara_a_sanchez", alt: "Распечатки, ручки и маркеры-текстовыделители" },
  "rail-4": { src: "https://images.unsplash.com/photo-1766801075422-f67a43944c26?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Daniel Tasci on Unsplash", creditHref: "https://unsplash.com/@shotbydani", alt: "Карта с булавками; нитей между булавками нет" },
  "rail-5": { src: "https://images.unsplash.com/photo-1704265586142-db3e17d0dea0?w=1600&q=80&auto=format&fit=crop", credit: "Photo by William Warby on Unsplash", creditHref: "https://unsplash.com/@wwarby", alt: "Механический секундомер крупно на чёрном фоне; клавиатуры в кадре нет" },
  "rail-6": { src: "https://images.unsplash.com/photo-1765917393220-78ed33e7e07b?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Jess Bailey on Unsplash", creditHref: "https://unsplash.com/@jessbaileydesigns", alt: "Блокнот, линейка и клавиатура сверху на светлой поверхности" },
  "blog-hero-1a": { src: "https://images.unsplash.com/photo-1633304557382-979afee9f9a2?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Justin Morgan on Unsplash", creditHref: "https://unsplash.com/@justin_morgan", alt: "Флэтлей: ноутбук, блокнот, ручка, очки на тёмном столе" },
  "blog-hero-1b": { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Luke Chesser on Unsplash", creditHref: "https://unsplash.com/@lukechesser", alt: "Графики аналитики на экране ноутбука под углом" },
  "blog-2a": { src: "https://images.unsplash.com/photo-1582134534564-76ae09c71e3b?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Kelly Sikkema on Unsplash", creditHref: "https://unsplash.com/@kellysikkema", alt: "Белые листы бумаги на чёрном столе, ручки и телефон" },
  "blog-2b": { src: "https://images.unsplash.com/photo-1552120476-9ee56c8611f7?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Markus Spiske on Unsplash", creditHref: "https://unsplash.com/@markusspiske", alt: "Макро экрана с текстом/кодом; адресной строки нет" },
  "blog-3a": { src: "https://images.unsplash.com/photo-1693278617452-cfa5f34bc54b?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Mick Haupt on Unsplash", creditHref: "https://unsplash.com/@rocinante_11", alt: "Словарная статья крупно (печатный текст); выделения маркером нет" },
  "blog-3b": { src: "https://images.unsplash.com/photo-1743715032626-69e4477acac0?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Angelo Casto on Unsplash", creditHref: "https://unsplash.com/@jddartphotographer", alt: "Старинные весы с овощами (натюрморт); не аптечные" },
  "blog-4a": { src: "https://images.unsplash.com/photo-1553864250-05b20249ee0c?w=1600&q=80&auto=format&fit=crop", credit: "Photo by T.H. Chia on Unsplash", creditHref: "https://unsplash.com/@teckhonc", alt: "Булавка в карте, малая глубина резкости; нитей нет" },
  "blog-4b": { src: "https://images.unsplash.com/photo-1764948620467-2b08f6843dd6?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Andrey Soldatov on Unsplash", creditHref: "https://unsplash.com/@andrilliardbond", alt: "Старый чертёжный циркуль на белой бумаге, крупно" },
  "blog-5a": { src: "https://images.unsplash.com/photo-1758440519640-7234ba375d2e?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Arya Arjun on Unsplash", creditHref: "https://unsplash.com/@aryaarjun", alt: "Металлические цепи и кольца на тёмном фоне; цепь не разорвана" },
  "blog-5b": { src: "https://images.unsplash.com/photo-1715078795172-c1636d5bc845?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Decry.Yae on Unsplash", creditHref: "https://unsplash.com/@dayee", alt: "Монитор и клавиатура в тёмной комнате при лампе; не макро" },
  "blog-6a": { src: "https://images.unsplash.com/photo-1764557380057-53ff582146b8?w=1600&q=80&auto=format&fit=crop", credit: "Photo by JJ ROCHA on Unsplash", creditHref: "https://unsplash.com/@that_person", alt: "Блокнот, ручка и мелкий инструмент на дереве; линейки может не быть" },
  "blog-6b": { src: "https://images.unsplash.com/photo-1771923082503-0a3381c46cef?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Neil Fernandez on Unsplash", creditHref: "https://unsplash.com/@studiosphere", alt: "Ноутбук с тёмным дашбордом (таблицы/панели)" },
  "blog-7a": { src: "https://images.unsplash.com/photo-1767869168302-36138e59cc18?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Tolga deniz Aran on Unsplash", creditHref: "https://unsplash.com/@sanlad", alt: "Конверт с маркой и почтовым штемпелем; на марке мелкая надпись" },
  "blog-7b": { src: "https://images.unsplash.com/photo-1508317469940-e3de49ba902e?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Branko Stancevic on Unsplash", creditHref: "https://unsplash.com/@landb", alt: "Код (HTML/CSS) на мониторе, макро" },
  "blog-8a": { src: "https://images.unsplash.com/photo-1777446695149-927b3aec69e1?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Artem Korolev on Unsplash", creditHref: "https://unsplash.com/@artemisss666", alt: "Деревянная касса с металлическими литерами" },
  "blog-8b": { src: "https://images.unsplash.com/photo-1772618379791-4532fe76d050?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Amanz on Unsplash", creditHref: "https://unsplash.com/@amanz", alt: "Смартфон сбоку крупно на тёмной поверхности; экран почти не виден" },
  "blog-9a": { src: "https://images.unsplash.com/photo-1758873263563-5ba4aa330799?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Hans Westbeek on Unsplash", creditHref: "https://unsplash.com/@hanswestbeek", alt: "Цифровой штангенциркуль на металлической детали; в кадре руки (без лица), угольника нет" },
  "blog-9b": { src: "https://images.unsplash.com/photo-1731686602391-7484df33a03c?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Annie Spratt on Unsplash", creditHref: "https://unsplash.com/@anniespratt", alt: "Чек с цифрами на деревянном столе" },
  "blog-10a": { src: "https://images.unsplash.com/photo-1744329629767-80ba7dc0cea6?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Zoshua Colah on Unsplash", creditHref: "https://unsplash.com/@zoshuacolah", alt: "Засов с навесным замком на стыке тёмных дверных створок" },
  "blog-10b": { src: "https://images.unsplash.com/photo-1742072593996-ebdc5d605a54?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Peaky Frames on Unsplash", creditHref: "https://unsplash.com/@rashedpaykary", alt: "Код на тёмном экране, макро" },
  "blog-11a": { src: "https://images.unsplash.com/photo-1767514569487-f7244c002e3e?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Valentin Zickner on Unsplash", creditHref: "https://unsplash.com/@vzickner", alt: "Старые механические кухонные весы с семечками; не чашечные" },
  "blog-11b": { src: "https://images.unsplash.com/photo-1762427907123-c7ab022a5de7?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Cht Gsml on Unsplash", creditHref: "https://unsplash.com/@karepesinde", alt: "Калькулятор, бумаги, очки, канцелярия на столе" },
  "rev-1a": { src: "https://images.unsplash.com/photo-1758025554726-50b7ed346394?w=1600&q=80&auto=format&fit=crop", credit: "Photo by rawkkim on Unsplash", creditHref: "https://unsplash.com/@rawkkim", alt: "Интерьер магазина с витринами и мебелью для сидения; не мебельный шоурум" },
  "rev-1b": { src: "https://images.unsplash.com/photo-1563628631561-cc80533f6826?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Matt Wojtaś on Unsplash", creditHref: "https://unsplash.com/@matt_wojtas", alt: "Выключенный монитор, клавиатура и кресло в светлом офисе" },
  "rev-2a": { src: "https://images.unsplash.com/photo-1698919585695-546e4a31fc8f?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Boitumelo on Unsplash", creditHref: "https://unsplash.com/@writecodenow", alt: "Рабочее место: два монитора и ноутбук, без человека" },
  "rev-2b": { src: "https://images.unsplash.com/photo-1633360821222-7e8df83639fb?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Towfiqu barbhuiya on Unsplash", creditHref: "https://unsplash.com/@towfiqu999999", alt: "Бумаги и ручка на столе" },
  "rev-3a": { src: "https://images.unsplash.com/photo-1748050869483-f3c34120c3ff?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Neon Wang on Unsplash", creditHref: "https://unsplash.com/@neonwangphotography", alt: "Пустая переговорная: длинный стол и кресла" },
  "rev-3b": { src: "https://images.unsplash.com/photo-1631557777127-6495c07ba6b9?w=1600&q=80&auto=format&fit=crop", credit: "Photo by 2H Media on Unsplash", creditHref: "https://unsplash.com/@2hmedia", alt: "Стопка документов веером на столе; самой папки нет" },
  "rev-4a": { src: "https://images.unsplash.com/photo-1738255654134-1877cb984a8f?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Jiří Navrátil on Unsplash", creditHref: "https://unsplash.com/@stillwell_", alt: "Ноутбук с кодом в темноте" },
  "rev-4b": { src: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Mohammad Rahmani on Unsplash", creditHref: "https://unsplash.com/@afgprogrammer", alt: "Редактор кода на экране ноутбука под углом" },
  "rev-5a": { src: "https://images.unsplash.com/photo-1642844819197-5f5f21b89ff8?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Ozkan Guner on Unsplash", creditHref: "https://unsplash.com/@dentistozkanguner", alt: "Стоматологический кабинет: кресло и монитор, без людей" },
  "rev-5b": { src: "https://images.unsplash.com/photo-1736238949295-887762109a54?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Ali Pli on Unsplash", creditHref: "https://unsplash.com/@ali_alipli", alt: "Смартфон на столе рядом с клавиатурой" },
  "rev-6a": { src: "https://images.unsplash.com/photo-1745921204896-c2011440a4e2?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Stefan Lehner on Unsplash", creditHref: "https://unsplash.com/@st_lehner", alt: "Станки и оборудование в цехе, без людей" },
  "rev-6b": { src: "https://images.unsplash.com/photo-1633307057722-a4740ba0c5d0?w=1600&q=80&auto=format&fit=crop", credit: "Photo by Justin Morgan on Unsplash", creditHref: "https://unsplash.com/@justin_morgan", alt: "Экран с линейным графиком аналитики" },
};

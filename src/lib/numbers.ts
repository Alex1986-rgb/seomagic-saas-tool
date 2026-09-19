/**
 * Числа из базы приходят не всегда числами: numeric превращается в строку,
 * незаполненное поле — в null. Значения по умолчанию у параметров React от
 * этого не спасают: они срабатывают только для undefined. Поэтому любое
 * значение, над которым будет арифметика или округление, прогоняем через это.
 */
export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  const parsed = Number.parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

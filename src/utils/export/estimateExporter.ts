import * as XLSX from 'xlsx';
import { OptimizationItem } from '@/types/audit/optimization-types';

interface EstimateTotals {
  subtotal: number;
  discount: number;
  final: number;
}

/**
 * Export estimate to Excel format with multiple sheets
 */
export async function exportEstimateToExcel(
  items: OptimizationItem[],
  totals: EstimateTotals,
  url: string
): Promise<Blob> {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    ['SEO Аудит - Смета на оптимизацию'],
    [],
    ['Сайт:', url],
    ['Дата:', new Date().toLocaleDateString('ru-RU')],
    [],
    ['Показатель', 'Значение'],
    ['Итого работ:', `${totals.subtotal.toLocaleString('ru-RU')} ₽`],
    ['Скидка:', `${totals.discount.toLocaleString('ru-RU')} ₽`],
    ['К оплате:', `${totals.final.toLocaleString('ru-RU')} ₽`],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Сводка');

  // Sheet 2: Detailed breakdown by category
  const categoryTotals = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { count: 0, cost: 0 };
    }
    acc[item.category].count += item.count;
    acc[item.category].cost += item.cost * item.count;
    return acc;
  }, {} as Record<string, { count: number; cost: number }>);

  const categoryData = [
    ['Смета по категориям'],
    [],
    ['Категория', 'Количество', 'Стоимость'],
    ...Object.entries(categoryTotals).map(([category, data]) => [
      category,
      data.count,
      `${data.cost.toLocaleString('ru-RU')} ₽`
    ]),
    [],
    ['Итого:', Object.values(categoryTotals).reduce((sum, d) => sum + d.count, 0), `${totals.subtotal.toLocaleString('ru-RU')} ₽`]
  ];
  const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
  XLSX.utils.book_append_sheet(workbook, categorySheet, 'По категориям');

  // Sheet 3: Full item details
  const detailsData = [
    ['Детализация работ'],
    [],
    ['Категория', 'Тип', 'Количество', 'Цена за единицу', 'Сумма'],
    ...items.map(item => [
      item.category,
      item.type,
      item.count,
      `${item.cost.toLocaleString('ru-RU')} ₽`,
      `${(item.cost * item.count).toLocaleString('ru-RU')} ₽`
    ])
  ];
  const detailsSheet = XLSX.utils.aoa_to_sheet(detailsData);
  XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Детализация');

  // Generate binary
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * Export estimate to CSV format
 */
export async function exportEstimateToCSV(
  items: OptimizationItem[],
  url: string
): Promise<Blob> {
  const csvRows = [
    ['Смета на SEO-оптимизацию'],
    [`Сайт: ${url}`],
    [`Дата: ${new Date().toLocaleDateString('ru-RU')}`],
    [],
    ['Категория', 'Тип', 'Количество', 'Цена за единицу', 'Сумма'],
    ...items.map(item => [
      item.category,
      item.type,
      item.count,
      item.cost,
      item.cost * item.count
    ])
  ];

  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generate filename for estimate export
 */
export function generateEstimateFilename(url: string, extension: string): string {
  const cleanUrl = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]/gi, '-');
  const date = new Date().toISOString().split('T')[0];
  return `estimate-${cleanUrl}-${date}.${extension}`;
}
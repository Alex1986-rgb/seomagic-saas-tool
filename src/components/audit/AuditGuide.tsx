
import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AuditGuideProps {
  onClose: () => void;
}

const AuditGuide: React.FC<AuditGuideProps> = ({ onClose }) => {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-12 relative">
      <Card className="border-primary/20 shadow-lg max-w-4xl mx-auto">
        <CardHeader className="relative border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">
            Руководство по SEO аудиту сайта
          </CardTitle>
          <CardDescription className="text-center text-base">
            Полное руководство по проведению комплексного аудита и оптимизации
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          {/* Этап 1: Запуск аудита */}
          <section className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">1</Badge>
              Запуск SEO аудита
            </h3>
            <div className="ml-8 space-y-3">
              <p>Для проведения комплексного SEO аудита:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Введите URL сайта в поле на главной странице.</li>
                <li>
                  Выберите тип анализа:
                  <ul className="list-disc pl-6 mt-1 space-y-1">
                    <li><span className="font-medium">Базовый аудит:</span> Быстрая проверка основных SEO параметров</li>
                    <li><span className="font-medium">Глубокий анализ:</span> Детальное сканирование всех страниц</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          {/* Этап 2: Результаты аудита */}
          <section className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">2</Badge>
              Результаты сканирования
            </h3>
            <div className="ml-8 space-y-3">
              <p>После завершения сканирования вы получите:</p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Общий SEO-скор сайта</li>
                <li>Список технических ошибок</li>
                <li>Анализ контента</li>
                <li>Рекомендации по оптимизации</li>
                <li>Смету на исправление ошибок</li>
              </ul>
            </div>
          </section>

          {/* Этап 3: Категории ошибок */}
          <section className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">3</Badge>
              Расшифровка списка ошибок
            </h3>
            <div className="ml-8 space-y-4">
              <p>Ошибки разделены на три категории:</p>
              
              <div className="rounded-md overflow-hidden border border-red-200 dark:border-red-900">
                <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2">
                  <h4 className="text-red-700 dark:text-red-400 font-medium">Критические ошибки</h4>
                </div>
                <div className="p-4">
                  <p className="mb-2">Серьезно влияют на SEO и требуют немедленного исправления:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Отсутствие HTTPS</li>
                    <li>Страницы с кодом 4xx/5xx</li>
                    <li>Битые ссылки</li>
                    <li>Отсутствие или дублирование тегов title/description</li>
                  </ul>
                </div>
              </div>
              
              <div className="rounded-md overflow-hidden border border-amber-200 dark:border-amber-900">
                <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2">
                  <h4 className="text-amber-700 dark:text-amber-400 font-medium">Важные улучшения</h4>
                </div>
                <div className="p-4">
                  <p className="mb-2">Значительно повышают эффективность сайта:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Проблемы со структурой заголовков</li>
                    <li>Отсутствие alt-текстов у изображений</li>
                    <li>Проблемы с индексацией</li>
                    <li>Слишком длинные/короткие мета-теги</li>
                  </ul>
                </div>
              </div>
              
              <div className="rounded-md overflow-hidden border border-green-200 dark:border-green-900">
                <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2">
                  <h4 className="text-green-700 dark:text-green-400 font-medium">Возможности</h4>
                </div>
                <div className="p-4">
                  <p className="mb-2">Рекомендации для дальнейшей оптимизации:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Оптимизация скорости загрузки</li>
                    <li>Улучшение мобильной версии</li>
                    <li>Добавление структурированных данных</li>
                    <li>Оптимизация контента и ключевых слов</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Этап 4: Смета на оптимизацию */}
          <section className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">4</Badge>
              Смета на оптимизацию
            </h3>
            <div className="ml-8 space-y-3">
              <p>Система автоматически формирует смету на исправление найденных проблем. Стоимость рассчитывается на основе:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Количества страниц на сайте</li>
                <li>Типа и сложности обнаруженных проблем</li>
                <li>Необходимости оптимизации контента</li>
                <li>Необходимости технических изменений</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-1">
                Смета включает подробную разбивку стоимости по категориям работ и рекомендациям.
              </p>
            </div>
          </section>

          {/* Этап 5: Экспорт результатов */}
          <section className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">5</Badge>
              Экспорт результатов
            </h3>
            <div className="ml-8 space-y-3">
              <p>Используйте инструменты экспорта для сохранения отчета в форматах:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><span className="font-medium">PDF-отчет</span> - подробный отчет с графиками и рекомендациями</li>
                <li><span className="font-medium">HTML-экспорт</span> - интерактивная веб-страница с результатами</li>
                <li><span className="font-medium">JSON</span> - структурированные данные для интеграции</li>
                <li><span className="font-medium">XML-карта сайта</span> - для отправки в поисковые системы</li>
              </ul>
            </div>
          </section>

          {/* Этап 6: Оптимизация */}
          <section className="space-y-3 bg-primary/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">6</Badge>
              Запуск процесса оптимизации
            </h3>
            <div className="ml-8 space-y-3">
              <p>После анализа результатов вы можете запустить автоматическую оптимизацию сайта, которая:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Создаст оптимизированные версии страниц</li>
                <li>Исправит основные технические ошибки</li>
                <li>Улучшит контент с учетом SEO-рекомендаций</li>
                <li>Предоставит архив с оптимизированной версией сайта</li>
              </ul>
              <p className="text-sm italic">Процесс оптимизации доступен после оплаты согласно сформированной смете.</p>
            </div>
          </section>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Button onClick={onClose} size="lg">
            Начать аудит сайта
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuditGuide;

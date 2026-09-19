import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle, BarChart3, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Отчёты.
 *
 * Страница показывала отчёты, которых сервис не делает: четыре «типа
 * отчётов» с выдуманным числом страниц и графиков (включая «Анализ
 * конкурентов»), экспорт в DOCX, XLSX и HTML с «размерами файлов», еженедельную
 * рассылку «каждый понедельник в 9:00», брендинг с загрузкой логотипа и
 * кнопки «Скачать образец», «Сгенерировать отчет», «Скачать в …», «Управление
 * подписками», «Загрузить логотип», «Выбрать цвета» — ни одна не работала.
 *
 * Теперь описан отчёт, который есть на самом деле: результаты аудита по
 * страницам, выгрузка в PDF и JSON со страницы результатов.
 */
const PerformanceReports: React.FC = () => {
  const pdfSections = [
    'Общая оценка сайта',
    'Найденные проблемы',
    'Смета оптимизации',
    'Статистика по страницам'
  ];

  const pageChecks = [
    'Код ответа и цепочки редиректов',
    'Title, meta description и заголовки H1–H3',
    'Canonical и индексируемость',
    'Время ответа сервера и время загрузки',
    'Сжатие страниц',
    'Изображения без alt и объём текста'
  ];

  const exportFormats = [
    { format: 'PDF', description: 'Отчёт для чтения, печати и отправки клиенту или руководству' },
    { format: 'JSON', description: 'Исходные данные аудита для собственной обработки' }
  ];

  return (
    <Layout>
      <PageSeo
        title="Отчёты об аудите сайта: что входит и как выгрузить"
        description="Результаты аудита по каждой странице: ошибки, скорость ответа, метатеги. Отчёт выгружается в PDF и JSON со страницы результатов."
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Навигация */}
        <div className="mb-8">
          <Link to="/features" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Все возможности</span>
          </Link>
        </div>

        {/* Шапка */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Отчетность
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">Отчеты об аудите</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            После аудита результаты по каждой странице доступны в личном кабинете,
            а отчёт можно выгрузить в PDF или JSON.
          </p>
        </motion.div>

        <motion.div
          className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Что проверяется на каждой странице
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {pageChecks.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Разделы PDF-отчёта
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {pdfSections.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Форматы выгрузки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportFormats.map((format) => (
                  <div key={format.format} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{format.format}</h4>
                    <p className="text-sm text-muted-foreground">{format.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Кнопки выгрузки находятся на странице результатов аудита. Автоматической рассылки
                отчётов на почту и брендирования своим логотипом сейчас нет.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Получите отчёт по своему сайту</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Запустите аудит — когда проверка закончится, отчёт можно будет скачать
                со страницы результатов.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Запустить аудит</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/demo">Посмотреть демо</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PerformanceReports;

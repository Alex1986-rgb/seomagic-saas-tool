
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

const UserGuide: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Руководство пользователя</h2>
        
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2">1</span>
              Регистрация и вход
            </h3>
            <div className="ml-8 mt-4 space-y-4">
              <p>Для начала работы необходимо зарегистрироваться или войти в систему:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Нажмите кнопку «Регистрация» в верхнем правом углу главной страницы.</li>
                <li>Заполните необходимые поля: имя, электронная почта и пароль.</li>
                <li>Подтвердите адрес электронной почты, перейдя по ссылке в письме.</li>
                <li>После подтверждения вы можете войти в систему, используя вашу электронную почту и пароль.</li>
              </ol>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2">2</span>
              Запуск SEO аудита
            </h3>
            <div className="ml-8 mt-4 space-y-4">
              <p>Для проведения SEO аудита вашего сайта:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>На главной странице или в разделе «Аудит» введите URL вашего сайта в поле ввода.</li>
                <li>Нажмите кнопку «Начать аудит».</li>
                <li>Система начнет сканирование вашего сайта. Это может занять некоторое время в зависимости от размера сайта.</li>
                <li>После завершения сканирования вы увидите подробный отчет о SEO-состоянии вашего сайта.</li>
              </ol>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2">3</span>
              Анализ отчета
            </h3>
            <div className="ml-8 mt-4 space-y-4">
              <p>Отчет о SEO аудите содержит следующие разделы:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Общий SEO-скор</strong> — оценка общего состояния сайта с точки зрения SEO.</li>
                <li><strong>Технические проблемы</strong> — список технических ошибок, влияющих на SEO.</li>
                <li><strong>Проблемы контента</strong> — анализ текстового содержания страниц.</li>
                <li><strong>Структура сайта</strong> — информация о структуре и навигации сайта.</li>
                <li><strong>Внутренняя оптимизация</strong> — анализ мета-тегов, заголовков и других элементов.</li>
                <li><strong>Рекомендации</strong> — конкретные рекомендации по улучшению SEO.</li>
              </ul>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2">4</span>
              Оптимизация сайта
            </h3>
            <div className="ml-8 mt-4 space-y-4">
              <p>После получения отчета вы можете:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Перейти к разделу «Оптимизация» для автоматического исправления обнаруженных проблем.</li>
                <li>Выбрать проблемы, которые вы хотите исправить автоматически.</li>
                <li>Нажать кнопку «Оптимизировать» для начала процесса оптимизации.</li>
                <li>После завершения вы получите обновленный SEO-скор и отчет о внесенных изменениях.</li>
              </ol>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2">5</span>
              Отслеживание позиций
            </h3>
            <div className="ml-8 mt-4 space-y-4">
              <p>Для отслеживания позиций вашего сайта в поисковых системах:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Перейдите в раздел «Отслеживание позиций».</li>
                <li>Добавьте ключевые слова, по которым вы хотите отслеживать позиции.</li>
                <li>Настройте регион и поисковую систему для отслеживания.</li>
                <li>Нажмите «Начать отслеживание».</li>
                <li>Система будет регулярно проверять позиции вашего сайта и отображать изменения в виде графиков и таблиц.</li>
              </ol>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2">6</span>
              Экспорт и публикация результатов
            </h3>
            <div className="ml-8 mt-4 space-y-4">
              <p>Для экспорта и публикации результатов:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>В отчете аудита нажмите кнопку «Экспорт».</li>
                <li>Выберите формат экспорта (PDF, HTML, JSON).</li>
                <li>При необходимости публикации измененных файлов на ваш хостинг используйте функцию «Опубликовать».</li>
                <li>Введите данные доступа к вашему хостингу (FTP, cPanel) и выберите файлы для публикации.</li>
                <li>Подтвердите действие, и система автоматически опубликует изменения.</li>
              </ol>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default UserGuide;

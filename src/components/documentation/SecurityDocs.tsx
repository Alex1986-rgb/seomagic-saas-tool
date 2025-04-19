
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, AlertTriangle, Eye } from 'lucide-react';

const SecurityDocs: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Безопасность и защита данных</h2>
        
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Защита данных
            </h3>
            <div className="mt-4 space-y-4">
              <p>SeoMarket обеспечивает безопасность данных:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>HTTPS:</strong> Шифрование всех коммуникаций</li>
                <li><strong>Хранение данных:</strong> Шифрование чувствительной информации</li>
                <li><strong>Изоляция:</strong> Полная изоляция данных разных пользователей</li>
                <li><strong>Бэкапы:</strong> Регулярное резервное копирование</li>
              </ul>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <Lock className="h-5 w-5 mr-2 text-primary" />
              Безопасность аудита
            </h3>
            <div className="mt-4 space-y-4">
              <p>При проведении аудита сайта:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Все данные сканирования хранятся только в вашем аккаунте</li>
                <li>Информация не передается третьим лицам</li>
                <li>Соблюдаются ограничения robots.txt</li>
                <li>Уважаются лимиты нагрузки на сервер</li>
              </ul>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
              Рекомендации
            </h3>
            <div className="mt-4 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Используйте надежные пароли</li>
                <li>Включите двухфакторную аутентификацию</li>
                <li>Регулярно меняйте пароль</li>
                <li>Не оставляйте сессию открытой</li>
              </ul>
            </div>
          </section>
          
          <div className="mt-12 p-4 bg-orange-500/10 border border-orange-500/30 rounded-md">
            <h4 className="text-lg font-medium flex items-center text-orange-500">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Сообщить об уязвимости
            </h4>
            <p className="mt-2">
              Обнаружили уязвимость? Сообщите нам на <a href="mailto:security@seomarket.ru" className="text-primary underline">security@seomarket.ru</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityDocs;


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
        <h2 className="text-2xl font-bold mb-6">Документация по безопасности</h2>
        
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Общие меры безопасности
            </h3>
            <div className="mt-4 space-y-4">
              <p>SeoMarket использует следующие общие меры безопасности:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>HTTPS:</strong> Все коммуникации защищены с помощью SSL/TLS шифрования.</li>
                <li><strong>Хеширование паролей:</strong> Пароли пользователей хранятся в хешированном виде с использованием bcrypt.</li>
                <li><strong>Защита от CSRF:</strong> Использование CSRF-токенов для всех форм приложения.</li>
                <li><strong>XSS защита:</strong> Экранирование пользовательского ввода и использование Content Security Policy.</li>
                <li><strong>Защита от SQL-инъекций:</strong> Параметризованные запросы и ORM.</li>
                <li><strong>Rate limiting:</strong> Ограничение количества запросов для предотвращения DDoS атак.</li>
              </ul>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <Lock className="h-5 w-5 mr-2 text-primary" />
              Аутентификация и авторизация
            </h3>
            <div className="mt-4 space-y-4">
              <p>Система аутентификации и авторизации:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>JWT (JSON Web Tokens):</strong> Используются для аутентификации пользователей и управления сессиями.</li>
                <li><strong>Ролевая модель:</strong> Система ролей и разрешений для контроля доступа к функциям (админ, пользователь).</li>
                <li><strong>Многофакторная аутентификация:</strong> Дополнительный уровень защиты для административного доступа.</li>
                <li><strong>Время жизни токенов:</strong> Токены имеют ограниченное время жизни для минимизации рисков.</li>
              </ul>
              <p>Пример JWT токена (структура):</p>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "1234567890",
  "name": "John Doe",
  "role": "user",
  "iat": 1516239022,
  "exp": 1516242622
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)`}
              </pre>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <Key className="h-5 w-5 mr-2 text-primary" />
              Защита данных
            </h3>
            <div className="mt-4 space-y-4">
              <p>Меры по защите пользовательских данных:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Шифрование данных в состоянии покоя:</strong> Чувствительные данные шифруются при хранении.</li>
                <li><strong>Минимизация данных:</strong> Сбор только необходимой информации для функционирования сервиса.</li>
                <li><strong>Изоляция данных:</strong> Данные разных пользователей строго изолированы друг от друга.</li>
                <li><strong>Регулярное резервное копирование:</strong> Защита от потери данных.</li>
                <li><strong>Политика сохранения данных:</strong> Удаление устаревших данных согласно политике.</li>
              </ul>
              <p>При обработке данных аудита сайта:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Все данные, полученные при сканировании, хранятся только в аккаунте пользователя.</li>
                <li>Информация о сканировании не передается третьим лицам.</li>
                <li>Доступ к API сторонних сервисов (например, поисковых систем) осуществляется с учетом их условий использования.</li>
              </ul>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
              Меры предосторожности для пользователей
            </h3>
            <div className="mt-4 space-y-4">
              <p>Рекомендации по безопасности для пользователей:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Используйте сложные пароли длиной не менее 12 символов, включающие буквы, цифры и специальные символы.</li>
                <li>Не используйте один и тот же пароль для разных сервисов.</li>
                <li>Регулярно меняйте пароль к вашему аккаунту.</li>
                <li>Включите двухфакторную аутентификацию, если она доступна.</li>
                <li>Проверяйте URL в адресной строке перед вводом учетных данных (должен начинаться с https://seomarket.ru/).</li>
                <li>Не оставляйте сессию открытой на общедоступных компьютерах.</li>
                <li>Следите за подозрительной активностью в вашем аккаунте.</li>
              </ul>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold flex items-center">
              <Eye className="h-5 w-5 mr-2 text-primary" />
              Аудит безопасности
            </h3>
            <div className="mt-4 space-y-4">
              <p>SeoMarket регулярно проводит:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Аудит безопасности внутренней командой и внешними специалистами.</li>
                <li>Сканирование уязвимостей с использованием автоматизированных инструментов.</li>
                <li>Тестирование на проникновение для выявления потенциальных уязвимостей.</li>
                <li>Мониторинг и логирование всех действий в системе для раннего обнаружения аномалий.</li>
              </ul>
              <p>В случае обнаружения уязвимости:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Проблема немедленно анализируется командой безопасности.</li>
                <li>Разрабатывается и внедряется исправление в кратчайшие сроки.</li>
                <li>Пользователи уведомляются о проблеме, если это необходимо.</li>
                <li>Проводится анализ причин возникновения уязвимости для предотвращения подобных случаев в будущем.</li>
              </ol>
            </div>
          </section>
          
          <div className="mt-12 p-4 bg-orange-500/10 border border-orange-500/30 rounded-md">
            <h4 className="text-lg font-medium flex items-center text-orange-500">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Сообщение о уязвимостях
            </h4>
            <p className="mt-2">
              Если вы обнаружили уязвимость в нашей системе, пожалуйста, сообщите нам конфиденциально по адресу <a href="mailto:security@seomarket.ru" className="text-primary underline">security@seomarket.ru</a>. Мы ценим вклад сообщества в улучшение безопасности нашего сервиса.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityDocs;

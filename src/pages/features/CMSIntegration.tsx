
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Layers, Plug, Code, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CMSIntegration: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-8">
          <Link to="/features" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Все возможности</span>
          </Link>
        </div>

        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Интеграция
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Интеграция с CMS</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Совместимость с популярными CMS-системами: WordPress, Joomla, Drupal и другими.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="prose prose-lg max-w-none">
              <h2>Бесшовная интеграция с любой CMS</h2>
              
              <p>
                Наша платформа легко интегрируется с большинством популярных систем 
                управления контентом, обеспечивая автоматическую синхронизацию данных 
                и упрощая процесс SEO-оптимизации.
              </p>

              <h3>Поддерживаемые CMS:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardContent className="p-6">
                    <Code className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">WordPress</h4>
                    <p className="text-muted-foreground">
                      Полная интеграция с плагинами и автообновления
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Database className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Другие CMS</h4>
                    <p className="text-muted-foreground">
                      Joomla, Drupal, PrestaShop, Magento и другие
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Возможности интеграции:</h3>
              
              <ul>
                <li><strong>WordPress Plugin</strong> - Нативный плагин для WordPress</li>
                <li><strong>REST API</strong> - Универсальный API для любых систем</li>
                <li><strong>Webhook</strong> - Автоматические уведомления об изменениях</li>
                <li><strong>FTP/SFTP</strong> - Прямой доступ к файлам сайта</li>
                <li><strong>Database Connection</strong> - Прямое подключение к базе данных</li>
              </ul>

              <h3>Автоматические функции:</h3>
              
              <ul>
                <li><strong>Синхронизация контента</strong> - Автоматическое обновление данных</li>
                <li><strong>Применение оптимизаций</strong> - Внедрение рекомендаций без ручной работы</li>
                <li><strong>Мониторинг изменений</strong> - Отслеживание обновлений сайта</li>
                <li><strong>Резервное копирование</strong> - Создание бэкапов перед изменениями</li>
              </ul>

              <h3>Настройка интеграции:</h3>
              
              <p>
                Процесс интеграции максимально упрощен. Для WordPress достаточно 
                установить наш плагин, для других CMS - настроить API-ключи. 
                Подробные инструкции предоставляются для каждой платформы.
              </p>

              <h3>Безопасность интеграции:</h3>
              
              <p>
                Все интеграции используют безопасные протоколы передачи данных 
                с шифрованием. API-ключи имеют ограниченные права доступа только 
                к необходимым функциям SEO-оптимизации.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Поддерживаемые системы</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Layers size={16} className="mt-1 mr-2 text-primary" />
                    <span>WordPress</span>
                  </li>
                  <li className="flex items-start">
                    <Plug size={16} className="mt-1 mr-2 text-primary" />
                    <span>Joomla</span>
                  </li>
                  <li className="flex items-start">
                    <Code size={16} className="mt-1 mr-2 text-primary" />
                    <span>Drupal</span>
                  </li>
                  <li className="flex items-start">
                    <Database size={16} className="mt-1 mr-2 text-primary" />
                    <span>Любая CMS через API</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6">Настроить интеграцию</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CMSIntegration;

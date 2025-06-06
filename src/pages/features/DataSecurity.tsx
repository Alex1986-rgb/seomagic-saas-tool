
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Shield, Eye, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DataSecurity: React.FC = () => {
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
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Безопасность
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Безопасность данных</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Полная конфиденциальность и безопасность ваших данных с соблюдением GDPR.
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
              <h2>Максимальная защита ваших данных</h2>
              
              <p>
                Мы понимаем, насколько важна конфиденциальность ваших данных. Наша платформа 
                использует современные стандарты безопасности и полностью соответствует 
                требованиям GDPR для защиты персональных данных.
              </p>

              <h3>Меры безопасности:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardContent className="p-6">
                    <Shield className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Шифрование данных</h4>
                    <p className="text-muted-foreground">
                      256-битное шифрование всех данных при передаче и хранении
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Eye className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Контроль доступа</h4>
                    <p className="text-muted-foreground">
                      Строгая система прав доступа и аутентификации
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Соответствие стандартам:</h3>
              
              <ul>
                <li><strong>GDPR</strong> - Полное соответствие европейскому регламенту защиты данных</li>
                <li><strong>ISO 27001</strong> - Международный стандарт информационной безопасности</li>
                <li><strong>SOC 2 Type II</strong> - Аудит безопасности и доступности</li>
                <li><strong>SSL/TLS</strong> - Защищенное соединение для всех операций</li>
              </ul>

              <h3>Права пользователей по GDPR:</h3>
              
              <ul>
                <li><strong>Право на информацию</strong> - Полная прозрачность обработки данных</li>
                <li><strong>Право на доступ</strong> - Возможность получить копию ваших данных</li>
                <li><strong>Право на исправление</strong> - Возможность корректировать данные</li>
                <li><strong>Право на удаление</strong> - Полное удаление данных по запросу</li>
                <li><strong>Право на портативность</strong> - Экспорт данных в стандартных форматах</li>
              </ul>

              <h3>Физическая безопасность:</h3>
              
              <p>
                Наши серверы размещены в сертифицированных дата-центрах с многоуровневой 
                системой безопасности, включая биометрический контроль доступа, 
                видеонаблюдение 24/7 и резервное питание.
              </p>

              <h3>Регулярные аудиты:</h3>
              
              <p>
                Мы проводим регулярные внутренние и внешние аудиты безопасности, 
                тестирование на проникновение и обновление систем защиты в соответствии 
                с новейшими угрозами.
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
                <h3 className="text-xl font-semibold mb-4">Гарантии безопасности</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Lock size={16} className="mt-1 mr-2 text-primary" />
                    <span>Шифрование AES-256</span>
                  </li>
                  <li className="flex items-start">
                    <Shield size={16} className="mt-1 mr-2 text-primary" />
                    <span>Соответствие GDPR</span>
                  </li>
                  <li className="flex items-start">
                    <Eye size={16} className="mt-1 mr-2 text-primary" />
                    <span>Контроль доступа</span>
                  </li>
                  <li className="flex items-start">
                    <FileCheck size={16} className="mt-1 mr-2 text-primary" />
                    <span>Регулярные аудиты</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6">Узнать больше о безопасности</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DataSecurity;

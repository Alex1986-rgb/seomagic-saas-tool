
import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

const IPInfo: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold mb-6">Информация об IP-адресе</h1>
          <p className="text-muted-foreground mb-8">
            Здесь вы можете найти подробную информацию о вашем IP-адресе и его значении.
          </p>

          <div className="prose prose-lg max-w-none bg-card/30 p-8 rounded-lg border border-primary/10">
            <h2>Что такое IP-адрес?</h2>
            <p>IP-адрес (Internet Protocol Address) - это уникальный числовой идентификатор устройства в компьютерной сети, использующий интернет-протокол для связи.</p>

            <h2>Типы IP-адресов</h2>
            <ul>
              <li><strong>IPv4:</strong> Наиболее распространенный формат (например, 192.168.1.1)</li>
              <li><strong>IPv6:</strong> Новый формат с более широким адресным пространством</li>
            </ul>

            <h2>Зачем важно знать свой IP?</h2>
            <p>Знание IP-адреса полезно для:</p>
            <ul>
              <li>Диагностики сетевых проблем</li>
              <li>Настройки сетевого оборудования</li>
              <li>Обеспечения безопасности</li>
            </ul>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Button onClick={() => window.history.back()}>Вернуться назад</Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default IPInfo;

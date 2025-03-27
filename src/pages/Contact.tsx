
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-center"
        >
          Свяжитесь с нами
        </motion.h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          У вас есть вопросы или предложения? Заполните форму ниже, и мы свяжемся с вами в ближайшее время
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="neo-card p-8">
              <h2 className="text-2xl font-semibold mb-6">Отправить сообщение</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Имя</label>
                    <Input id="name" placeholder="Введите ваше имя" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" placeholder="email@example.com" type="email" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Тема</label>
                  <Input id="subject" placeholder="Тема вашего сообщения" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Сообщение</label>
                  <Textarea id="message" placeholder="Введите ваше сообщение" rows={5} />
                </div>
                
                <Button className="w-full">Отправить сообщение</Button>
              </form>
            </div>
          </div>
          
          <div>
            <div className="neo-card p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Контактная информация</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Адрес офиса</h3>
                    <p className="text-muted-foreground">
                      Россия, Москва, ул. Примерная, д. 123, офис 456
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Email адрес</h3>
                    <p className="text-muted-foreground">
                      info@seomarket.ru<br />
                      support@seomarket.ru
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Телефон</h3>
                    <p className="text-muted-foreground">
                      +7 (800) 123-45-67<br />
                      +7 (495) 987-65-43
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="neo-card p-8">
              <h2 className="text-2xl font-semibold mb-6">Мы в социальных сетях</h2>
              <div className="flex gap-4">
                <a href="#" className="h-12 w-12 flex items-center justify-center rounded-full bg-background hover:bg-primary/10 transition-colors">
                  <Facebook className="h-5 w-5 text-primary" />
                </a>
                <a href="#" className="h-12 w-12 flex items-center justify-center rounded-full bg-background hover:bg-primary/10 transition-colors">
                  <Twitter className="h-5 w-5 text-primary" />
                </a>
                <a href="#" className="h-12 w-12 flex items-center justify-center rounded-full bg-background hover:bg-primary/10 transition-colors">
                  <Instagram className="h-5 w-5 text-primary" />
                </a>
                <a href="#" className="h-12 w-12 flex items-center justify-center rounded-full bg-background hover:bg-primary/10 transition-colors">
                  <Linkedin className="h-5 w-5 text-primary" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="aspect-[2/1] rounded-lg overflow-hidden bg-secondary/30">
          <div className="w-full h-full opacity-70 text-center flex items-center justify-center">
            <span className="text-muted-foreground">Карта местоположения офиса</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

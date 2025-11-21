import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import SocialLinks from '@/components/contact/SocialLinks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Phone, Mail, MessageCircle, Headphones, Calendar } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';

const Contact: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Онлайн чат",
      description: "Мгновенная поддержка в реальном времени",
      action: "Начать чат",
      badge: "Онлайн",
      badgeColor: "bg-green-100 text-green-800"
    },
    {
      icon: Headphones,
      title: "Техническая поддержка",
      description: "Помощь с настройкой и использованием",
      action: "Связаться",
      badge: "24/7",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      icon: Calendar,
      title: "Консультация",
      description: "Персональная встреча с экспертом",
      action: "Записаться",
      badge: "Бесплатно",
      badgeColor: "bg-purple-100 text-purple-800"
    }
  ];

  const officeHours = [
    { day: "Понедельник - Пятница", time: "9:00 - 18:00 (МСК)" },
    { day: "Суббота", time: "10:00 - 16:00 (МСК)" },
    { day: "Воскресенье", time: "Выходной" }
  ];

  return (
    <Layout>
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Контакты', url: '/contact' }
      ]} />
      <LocalBusinessSchema />
      <OrganizationSchema />
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-20"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Мы всегда на связи
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
              >
                Свяжитесь с нами
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                Готовы помочь вам в достижении SEO-целей. Выберите удобный способ связи 
                или заполните форму ниже для получения персональной консультации
              </motion.p>
            </motion.div>

            {/* Support Options */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
              {supportOptions.map((option, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="neo-card h-full hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-8 text-center">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                          <option.icon className="w-8 h-8 text-primary" />
                        </div>
                        <Badge className={`${option.badgeColor} text-xs`}>
                          {option.badge}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{option.title}</h3>
                      <p className="text-muted-foreground mb-6">{option.description}</p>
                      <Button className="w-full">{option.action}</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
              {/* Contact Form - Takes more space */}
              <motion.div 
                className="xl:col-span-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Отправить сообщение</h2>
                  <p className="text-muted-foreground">
                    Заполните форму ниже, и наша команда свяжется с вами в течение 24 часов
                  </p>
                </div>
                <ContactForm />
              </motion.div>
              
              {/* Contact Info Sidebar */}
              <motion.div 
                className="xl:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="space-y-8">
                  <ContactInfo />
                  
                  {/* Working Hours */}
                  <Card className="neo-card">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Clock className="w-5 h-5 text-primary mr-2" />
                        <h3 className="font-semibold">Часы работы</h3>
                      </div>
                      <div className="space-y-3">
                        {officeHours.map((hours, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                            <span className="text-sm text-muted-foreground">{hours.day}</span>
                            <span className="text-sm font-medium">{hours.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Contact */}
                  <Card className="neo-card bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Быстрая связь</h3>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          <Phone className="w-4 h-4 mr-2" />
                          Позвонить сейчас
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Mail className="w-4 h-4 mr-2" />
                          Написать email
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Открыть чат
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
            
            {/* Map and Location Section */}
            <motion.div
              className="mt-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Наше местоположение</h2>
                <p className="text-muted-foreground">
                  Приходите к нам в офис для личной встречи
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Map */}
                <Card className="neo-card overflow-hidden">
                  <div className="h-80 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">Интерактивная карта</p>
                      <p className="text-sm text-primary mt-2">Загружается...</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                  </div>
                </Card>
                
                {/* Location Details */}
                <div className="space-y-6">
                  <Card className="neo-card">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <MapPin className="w-6 h-6 text-primary mr-3 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-2">Центральный офис</h3>
                          <address className="not-italic text-muted-foreground leading-relaxed">
                            Москва, ул. Примерная, д. 123,<br />
                            БЦ "Технополис", офис 456<br />
                            119991, Российская Федерация
                          </address>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="neo-card">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Как добраться</h3>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Станция метро "Примерная" - 5 минут пешком</span>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Автобусные остановки: 15, 25, 105</span>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Парковка: подземная, 2 часа бесплатно</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Button size="lg" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Записаться на встречу
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Social Links */}
            <SocialLinks />

            {/* FAQ Section */}
            <motion.div
              className="mt-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Часто задаваемые вопросы</h2>
                <p className="text-muted-foreground">
                  Ответы на популярные вопросы о наших услугах
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: "Как быстро вы отвечаете на обращения?",
                    answer: "Мы отвечаем на все обращения в течение 2-4 часов в рабочее время."
                  },
                  {
                    question: "Предоставляете ли вы техническую поддержку?",
                    answer: "Да, у нас есть круглосуточная техническая поддержка для всех клиентов."
                  },
                  {
                    question: "Можно ли получить консультацию бесплатно?",
                    answer: "Первичная консультация по SEO-стратегии предоставляется бесплатно."
                  },
                  {
                    question: "В каких городах вы работаете?",
                    answer: "Мы работаем удаленно по всей России, главный офис находится в Москве."
                  }
                ].map((faq, index) => (
                  <Card key={index} className="neo-card">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;


import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Layout>
      <div className="container px-4 py-16 mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">О сервисе SEO Market</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ваш надежный инструмент для анализа и оптимизации SEO показателей вашего сайта
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Наша миссия</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Мы стремимся сделать SEO-оптимизацию доступной и понятной для всех. Наша миссия — помочь 
                владельцам сайтов и маркетологам улучшить видимость их ресурсов в поисковых системах 
                с помощью передовых технологий анализа и понятных рекомендаций.
              </p>
              <p className="text-lg text-muted-foreground">
                Мы верим, что качественная SEO-оптимизация должна быть доступна каждому бизнесу, 
                независимо от его размера и бюджета.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                alt="Команда SEO Market за работой" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-10 text-center">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Комплексный анализ" 
              description="Наш сервис проводит всесторонний анализ вашего сайта, охватывая более 100 параметров SEO-оптимизации."
              icon="🔍"
            />
            <FeatureCard 
              title="Понятные рекомендации" 
              description="Мы не просто указываем на проблемы, но и предлагаем конкретные решения на понятном языке."
              icon="💡"
            />
            <FeatureCard 
              title="Мониторинг изменений" 
              description="Отслеживайте прогресс вашего сайта в поисковой выдаче и эффективность внедренных оптимизаций."
              icon="📈"
            />
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-10 text-center">Наша команда</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TeamMember 
              name="Алексей Петров" 
              position="Основатель и CEO"
              bio="Эксперт в области SEO с более чем 10-летним опытом работы с крупнейшими компаниями России."
              image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            />
            <TeamMember 
              name="Мария Иванова" 
              position="Технический директор"
              bio="Опыт разработки алгоритмов анализа и оптимизации для поисковых систем более 8 лет."
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            />
            <TeamMember 
              name="Дмитрий Соколов" 
              position="Руководитель аналитики"
              bio="Специалист по данным с фокусом на анализ поведенческих факторов и SEO-метрик."
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            />
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-10 text-center">Отзывы клиентов</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Testimonial 
              quote="SEO Market помог нам увеличить органический трафик на 180% за 6 месяцев. Рекомендации были точными и действенными."
              author="Ольга Смирнова"
              company="Директор по маркетингу, ООО «ТехноПлюс»"
            />
            <Testimonial 
              quote="Благодаря подробному аудиту мы смогли выявить и устранить критические ошибки на сайте, что привело к росту конверсии на 35%."
              author="Игорь Васильев"
              company="Владелец интернет-магазина «ЭкоТовары»"
            />
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mb-16 bg-primary/5 py-16 px-8 rounded-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Готовы улучшить SEO вашего сайта?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Получите бесплатный базовый аудит и узнайте, как увеличить видимость вашего сайта в поисковых системах.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/audit">Провести SEO-аудит</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing">Посмотреть тарифы</Link>
            </Button>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-10 text-center">Часто задаваемые вопросы</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FAQItem 
              question="Как быстро я получу результаты аудита?" 
              answer="Базовый аудит выполняется автоматически и занимает от 2 до 5 минут в зависимости от размера сайта. Расширенный аудит с ручной проверкой занимает до 48 часов."
            />
            <FAQItem 
              question="Подходит ли сервис для всех типов сайтов?" 
              answer="Да, наш сервис адаптирован для анализа различных типов сайтов: от корпоративных порталов до интернет-магазинов и информационных ресурсов."
            />
            <FAQItem 
              question="Как часто нужно проводить аудит?" 
              answer="Для оптимальных результатов рекомендуем проводить полный аудит раз в 3-6 месяцев, а также после значительных изменений на сайте."
            />
            <FAQItem 
              question="Можно ли получить консультацию специалиста?" 
              answer="Да, в рамках расширенных тарифов предусмотрены консультации наших экспертов по внедрению рекомендаций и стратегии SEO-продвижения."
            />
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

// Helper Components
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <Card className="h-full">
    <CardContent className="pt-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const TeamMember = ({ name, position, bio, image }: { name: string; position: string; bio: string; image: string }) => (
  <div className="text-center">
    <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-xl font-semibold">{name}</h3>
    <p className="text-primary mb-2">{position}</p>
    <p className="text-muted-foreground">{bio}</p>
  </div>
);

const Testimonial = ({ quote, author, company }: { quote: string; author: string; company: string }) => (
  <Card className="h-full">
    <CardContent className="pt-6">
      <p className="italic mb-4">"{quote}"</p>
      <Separator className="mb-4" />
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-muted-foreground">{company}</p>
    </CardContent>
  </Card>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
  <div>
    <h3 className="text-xl font-semibold mb-2">{question}</h3>
    <p className="text-muted-foreground">{answer}</p>
  </div>
);

export default About;

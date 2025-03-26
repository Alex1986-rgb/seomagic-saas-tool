
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, FileText, Search, TrendingUp, Star, Award } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="container px-4 py-16 mx-auto">
        {/* Hero Section with gradient background */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative text-center mb-24 py-20 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background"
        >
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            О сервисе SEO Market
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Профессиональный инструмент для анализа и 
            <span className="text-primary font-semibold"> оптимизации SEO показателей</span> вашего сайта
          </p>
        </motion.div>

        {/* Mission Section with modern card design */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-32"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
                <Star className="w-4 h-4 mr-2" />
                Наша миссия
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Делаем SEO доступным и <span className="text-primary">эффективным</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Мы создали инструмент, который помогает владельцам сайтов и маркетологам 
                улучшить видимость их ресурсов в поисковых системах, используя передовые 
                технологии анализа и понятные рекомендации.
              </p>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link to="/audit">
                  Попробовать бесплатно <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                alt="Команда SEO Market за работой" 
                className="rounded-3xl shadow-2xl transform -rotate-3 transition-transform hover:rotate-0 duration-500"
              />
            </div>
          </div>
        </motion.section>

        {/* Features Section with modern cards */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
              <Award className="w-4 h-4 mr-2" />
              Преимущества
            </div>
            <h2 className="text-4xl font-bold mb-6">Почему выбирают нас</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Наш сервис предоставляет комплексное решение для SEO-оптимизации
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Глубокий анализ" 
              description="Комплексная проверка более 100 параметров SEO-оптимизации вашего сайта"
              icon={<Search className="w-6 h-6" />}
            />
            <FeatureCard 
              title="Умные рекомендации" 
              description="Автоматически генерируемые рекомендации на основе анализа вашего сайта"
              icon={<FileText className="w-6 h-6" />}
            />
            <FeatureCard 
              title="Отслеживание прогресса" 
              description="Мониторинг изменений и эффективности внедренных оптимизаций"
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </div>
        </motion.section>

        {/* Team Section with modern cards */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
              <Globe className="w-4 h-4 mr-2" />
              Наша команда
            </div>
            <h2 className="text-4xl font-bold mb-6">Эксперты SEO Market</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Профессионалы с многолетним опытом в SEO-оптимизации
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TeamMember 
              name="Алексей Петров" 
              position="Основатель и CEO"
              bio="10+ лет опыта в SEO и работе с крупнейшими компаниями России"
              image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            />
            <TeamMember 
              name="Мария Иванова" 
              position="Технический директор"
              bio="Эксперт по разработке алгоритмов анализа и оптимизации"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            />
            <TeamMember 
              name="Дмитрий Соколов" 
              position="Руководитель аналитики"
              bio="Специалист по анализу поведенческих факторов и метрик"
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            />
          </div>
        </motion.section>

        {/* Testimonials with modern design */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Отзывы клиентов</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Что говорят о нас клиенты после использования сервиса
            </p>
          </div>
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

        {/* CTA Section with gradient */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative text-center rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 py-20 px-8"
        >
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
          <h2 className="text-4xl font-bold mb-6">Готовы улучшить SEO вашего сайта?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Получите бесплатный базовый аудит и узнайте, как увеличить видимость вашего сайта
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/audit" className="gap-2">
                Провести SEO-аудит <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing">Посмотреть тарифы</Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

// Helper Components with enhanced styling
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-card to-background">
    <CardContent className="p-8">
      <div className="mb-6 inline-flex p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const TeamMember = ({ name, position, bio, image }: { name: string; position: string; bio: string; image: string }) => (
  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
    <CardContent className="p-0">
      <div className="relative overflow-hidden">
        <div className="aspect-square">
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-primary mb-2">{position}</p>
        <p className="text-muted-foreground text-sm">{bio}</p>
      </div>
    </CardContent>
  </Card>
);

const Testimonial = ({ quote, author, company }: { quote: string; author: string; company: string }) => (
  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
    <CardContent className="p-8">
      <div className="mb-6 text-6xl text-primary/20">"</div>
      <p className="text-lg mb-6 text-foreground">{quote}</p>
      <Separator className="mb-6" />
      <div>
        <p className="font-semibold text-lg">{author}</p>
        <p className="text-sm text-muted-foreground">{company}</p>
      </div>
    </CardContent>
  </Card>
);

export default About;


import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail,
  MapPin,
  Calendar,
  Users,
  Award,
  Target,
  Zap,
  Heart,
  Star,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Team: React.FC = () => {
  const teamMembers = [
    {
      name: "Александр Кирьянов",
      role: "Основатель и CEO",
      description: "Эксперт в области SEO с 10-летним опытом. Основал SEO Platform с целью автоматизировать сложные процессы оптимизации.",
      experience: "10+ лет",
      projects: "500+",
      expertise: ["SEO Strategy", "Product Management", "Business Development"],
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
        email: "alexander@seoplatform.com"
      },
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Михаил Соколов",
      role: "Технический директор",
      description: "Опытный разработчик с фокусом на алгоритмы анализа данных и машинное обучение. Отвечает за архитектуру платформы.",
      experience: "8+ лет",
      projects: "300+",
      expertise: ["Machine Learning", "System Architecture", "Data Analysis"],
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
        email: "mikhail@seoplatform.com"
      },
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Екатерина Новикова",
      role: "Ведущий SEO-специалист",
      description: "Эксперт в области поисковой оптимизации и контент-маркетинга. Отвечает за разработку алгоритмов анализа и рекомендаций.",
      experience: "7+ лет",
      projects: "400+",
      expertise: ["Content Strategy", "Technical SEO", "Analytics"],
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
        email: "ekaterina@seoplatform.com"
      },
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8b5?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Дмитрий Васильев",
      role: "Ведущий Frontend-разработчик",
      description: "Специализируется на создании интуитивных интерфейсов с использованием современных технологий и фреймворков.",
      experience: "6+ лет",
      projects: "250+",
      expertise: ["React", "TypeScript", "UI/UX Design"],
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
        email: "dmitry@seoplatform.com"
      },
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Андрей Петров",
      role: "Ведущий Backend-разработчик",
      description: "Эксперт по высоконагруженным системам и обработке данных. Отвечает за серверную часть платформы и API.",
      experience: "9+ лет",
      projects: "350+",
      expertise: ["Node.js", "Database Design", "Cloud Architecture"],
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
        email: "andrey@seoplatform.com"
      },
      avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Ольга Смирнова",
      role: "UX/UI Дизайнер",
      description: "Креативный дизайнер с опытом разработки пользовательских интерфейсов для аналитических систем и SEO-инструментов.",
      experience: "5+ лет",
      projects: "200+",
      expertise: ["User Research", "Interface Design", "Prototyping"],
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
        email: "olga@seoplatform.com"
      },
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Команда | SEO Platform</title>
        <meta name="description" content="Познакомьтесь с профессиональной командой SEO Platform. Эксперты в области SEO, разработки и дизайна." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 rounded-full bg-primary/10 backdrop-blur-sm">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-primary to-orange-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-orange-400 bg-clip-text text-transparent">
            Наша команда
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Знакомьтесь с профессионалами, которые делают 
            <span className="text-primary font-semibold"> SEO Platform</span> лучшей платформой 
            для анализа и оптимизации
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2" />
              6 экспертов
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Award className="w-4 h-4 mr-2" />
              40+ лет совместного опыта
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Target className="w-4 h-4 mr-2" />
              2000+ успешных проектов
            </Badge>
          </div>
        </motion.div>

        {/* Team Stats */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Users, number: "6", label: "Членов команды", color: "text-blue-600" },
              { icon: Calendar, number: "5+", label: "Лет работы", color: "text-green-600" },
              { icon: Award, number: "40+", label: "Лет опыта", color: "text-purple-600" },
              { icon: Heart, number: "100%", label: "Преданности делу", color: "text-red-600" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Members */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Познакомьтесь с командой</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Каждый член нашей команды - это эксперт в своей области
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-primary/10">
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                        <p className="text-primary font-semibold mb-3">{member.role}</p>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {member.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-2 bg-primary/5 rounded-lg">
                            <div className="text-lg font-bold text-primary">{member.experience}</div>
                            <div className="text-xs text-muted-foreground">Опыт</div>
                          </div>
                          <div className="text-center p-2 bg-primary/5 rounded-lg">
                            <div className="text-lg font-bold text-primary">{member.projects}</div>
                            <div className="text-xs text-muted-foreground">Проектов</div>
                          </div>
                        </div>

                        {/* Expertise */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {member.expertise.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                            <Github className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                            <Twitter className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Company Culture */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="relative rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-orange-400/10 p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
            
            <div className="relative z-10 text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Корпоративная культура</h2>
              <p className="text-xl text-muted-foreground">
                Принципы, которые объединяют нашу команду
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  icon: Target,
                  title: "Стремление к совершенству",
                  description: "Мы постоянно совершенствуем наши навыки и продукт"
                },
                {
                  icon: Users,
                  title: "Командная работа",
                  description: "Вместе мы достигаем больших результатов"
                },
                {
                  icon: Zap,
                  title: "Инновации",
                  description: "Мы внедряем передовые технологии и подходы"
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Join Team CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="relative rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-8 md:p-12 text-white overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                Хотите присоединиться к команде?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Мы всегда ищем талантливых специалистов, готовых изменить мир SEO
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                  <Link to="/contact">
                    Связаться с нами
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 border-white text-white hover:bg-white hover:text-primary">
                  <Mail className="mr-2 h-5 w-5" />
                  careers@seoplatform.com
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default Team;

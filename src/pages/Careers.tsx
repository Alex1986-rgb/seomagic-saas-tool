
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Careers: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Карьера в SeoMarket</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Присоединяйтесь к нам и развивайтесь в команде профессионалов, 
            создающих инновационные решения для SEO
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold mb-6">Почему стоит присоединиться к нам</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-accent/50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Инновационные проекты</h3>
              <p className="text-muted-foreground">
                Работа над передовыми технологиями в области SEO и аналитики данных. 
                Возможность развивать реальные продукты, которыми пользуются тысячи компаний.
              </p>
            </div>
            
            <div className="bg-accent/50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Профессиональный рост</h3>
              <p className="text-muted-foreground">
                Мы поощряем обучение и развитие: курсы, конференции, семинары и 
                менторство от опытных специалистов отрасли.
              </p>
            </div>
            
            <div className="bg-accent/50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Гибкий график</h3>
              <p className="text-muted-foreground">
                Гибкие рабочие часы, возможность удаленной работы и 
                сбалансированный подход к рабочему времени.
              </p>
            </div>
            
            <div className="bg-accent/50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Дружеская атмосфера</h3>
              <p className="text-muted-foreground">
                Комфортная и дружелюбная рабочая среда, корпоративные мероприятия и 
                объединенная общими целями команда.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">Открытые вакансии</h2>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Senior Full Stack Developer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Мы ищем опытного Full Stack разработчика для работы над основным продуктом компании - 
                  платформой SEO-аналитики и оптимизации сайтов.
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium">Требования:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Опыт работы от 3 лет</li>
                    <li>Знание React, Node.js, TypeScript</li>
                    <li>Опыт работы с базами данных SQL и NoSQL</li>
                    <li>Понимание SEO принципов будет преимуществом</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Откликнуться</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>SEO-аналитик</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Требуется опытный SEO-аналитик для развития алгоритмов анализа и оптимизации сайтов, 
                  разработки рекомендаций и контентных стратегий.
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium">Требования:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Опыт в SEO от 2 лет</li>
                    <li>Глубокое понимание факторов ранжирования</li>
                    <li>Навыки работы с Google Analytics, Yandex Metrica</li>
                    <li>Аналитический склад ума и внимание к деталям</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Откликнуться</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>UX/UI Дизайнер</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Ищем креативного UX/UI дизайнера для разработки пользовательских интерфейсов 
                  аналитических дашбордов и отчетов платформы.
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium">Требования:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Портфолио с релевантными проектами</li>
                    <li>Опыт дизайна веб-приложений и аналитических интерфейсов</li>
                    <li>Знание Figma, Adobe XD или Sketch</li>
                    <li>Понимание принципов UX и базовые знания frontend-разработки</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Откликнуться</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Не нашли подходящую вакансию?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Отправьте нам свое резюме, и мы рассмотрим возможность сотрудничества
          </p>
          <Button size="lg">Отправить резюме</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;


import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Страница не найдена | SEO Platform</title>
        <meta name="description" content="Запрашиваемая страница не найдена. Вернитесь на главную или воспользуйтесь навигацией по сайту." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">404</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Страница не найдена
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              К сожалению, страница, которую вы ищете, не существует или была перемещена.
              Возможно, в URL есть опечатка или страница была удалена.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Что вы можете сделать:</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span>Проверьте правильность написания URL в адресной строке</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span>Вернитесь на главную страницу и воспользуйтесь навигацией</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span>Воспользуйтесь поиском по сайту</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span>Обратитесь в службу поддержки, если считаете, что это ошибка</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                На главную
              </Link>
            </Button>
            
            <Button variant="outline" asChild size="lg">
              <Link to="/audit">
                <Search className="mr-2 h-5 w-5" />
                SEO Аудит
              </Link>
            </Button>
            
            <Button variant="outline" asChild size="lg">
              <Link to="/support">
                <HelpCircle className="mr-2 h-5 w-5" />
                Поддержка
              </Link>
            </Button>
          </div>

          {/* Популярные страницы */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4">Популярные страницы:</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link 
                to="/features" 
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
                <span>Возможности платформы</span>
              </Link>
              
              <Link 
                to="/pricing" 
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
                <span>Тарифы и цены</span>
              </Link>
              
              <Link 
                to="/about" 
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
                <span>О компании</span>
              </Link>
              
              <Link 
                to="/contact" 
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
                <span>Контакты</span>
              </Link>
              
              <Link 
                to="/blog" 
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
                <span>Блог</span>
              </Link>
              
              <Link 
                to="/faq" 
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
                <span>FAQ</span>
              </Link>
            </div>
          </div>

          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Если вы считаете, что это ошибка на нашей стороне, пожалуйста, сообщите нам на{' '}
              <a href="mailto:support@seoplatform.com" className="text-primary hover:underline">
                support@seoplatform.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

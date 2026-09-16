
import React from 'react';
import Layout from '@/components/Layout';
import { OptimizationPlans } from '@/features/audit/components/results/components/optimization';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PageSeo from '@/components/seo/PageSeo';

const OptimizationPricing: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  /**
   * Раньше кнопка показывала «Тариф выбран», хотя выбор нигде не сохранялся,
   * а через секунду делала window.location.href = `/audit?plan=…`: адрес мимо
   * подпути публикации давал 404, да и страница аудита параметр plan не читает.
   * Настоящий путь к оптимизации — проверка сайта: по её итогам считается смета
   * и оставляется заявка на счёт. Туда и ведём, без обещания «выбранного» тарифа.
   */
  const handleSelectPlan = () => {
    toast({
      title: "Сначала проверим сайт",
      description: "Стоимость оптимизации считается по результатам аудита: введите адрес сайта, после проверки появятся смета и заявка на счёт.",
    });
    navigate('/site-audit');
  };
  
  return (
    <Layout>
      <PageSeo
        title="Тарифы на оптимизацию сайта и расчёт итоговой сметы"
        description="Сколько стоит оптимизация страниц: из чего складывается цена, что входит в работу и как получить смету по своему сайту онлайн."
      />
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link to="/pricing">
              <ArrowLeft className="h-4 w-4" />
              Вернуться к тарифам
            </Link>
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Тарифы на оптимизацию сайта</h1>
        <p className="mb-8 text-muted-foreground">
          Выберите наиболее подходящий для вас тариф в зависимости от размера вашего сайта и необходимых услуг оптимизации.
          Чем больше страниц в вашем проекте, тем выше скидка на услуги оптимизации.
        </p>
        
        <OptimizationPlans onSelectPlan={handleSelectPlan} />
      </div>
    </Layout>
  );
};

export default OptimizationPricing;

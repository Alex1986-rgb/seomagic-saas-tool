
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Страница не найдена | SeoMarket</title>
      </Helmet>
      
      <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
        <h1 className="text-7xl font-extrabold mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-6">Страница не найдена</h2>
        <p className="text-xl text-muted-foreground max-w-lg mb-8">
          Извините, но запрашиваемая вами страница не существует или была перемещена.
        </p>
        <Button asChild size="lg">
          <Link to="/">Вернуться на главную</Link>
        </Button>
      </div>
    </>
  );
};

export default NotFoundPage;

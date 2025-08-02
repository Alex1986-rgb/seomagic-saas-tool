
import React, { useEffect } from 'react';
import Layout from '../components/Layout';

const Index: React.FC = () => {
  useEffect(() => {
    console.log("✅ Index page mounted successfully!");
    document.title = "SEO Аудит и Оптимизация - SeoMarket";
    
    return () => {
      console.log("❌ Index page unmounted");
    };
  }, []);

  console.log("🎯 Index page rendering");
  
  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-primary">SEO Market</h1>
          <p className="text-xl text-muted-foreground">
            Добро пожаловать в систему SEO анализа и оптимизации
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

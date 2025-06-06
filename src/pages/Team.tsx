
import React from 'react';
import Layout from '@/components/Layout';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Team: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Наша команда</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Знакомьтесь с профессионалами, делающими SeoMarket лучшей платформой для SEO аудита и оптимизации
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Founder */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-muted mb-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark opacity-10"></div>
            </div>
            <h3 className="text-xl font-semibold">Александр Кирьянов</h3>
            <p className="text-muted-foreground mb-2">Основатель и CEO</p>
            <p className="text-sm text-center mb-4 max-w-xs">
              Эксперт в области SEO с 10-летним опытом. Основал SeoMarket с целью автоматизировать сложные процессы оптимизации.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          {/* CTO */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-muted mb-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark opacity-10"></div>
            </div>
            <h3 className="text-xl font-semibold">Михаил Соколов</h3>
            <p className="text-muted-foreground mb-2">Технический директор</p>
            <p className="text-sm text-center mb-4 max-w-xs">
              Опытный разработчик с фокусом на алгоритмы анализа данных и машинное обучение. Отвечает за архитектуру платформы.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          {/* SEO Expert */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-muted mb-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark opacity-10"></div>
            </div>
            <h3 className="text-xl font-semibold">Екатерина Новикова</h3>
            <p className="text-muted-foreground mb-2">Ведущий SEO-специалист</p>
            <p className="text-sm text-center mb-4 max-w-xs">
              Эксперт в области поисковой оптимизации и контент-маркетинга. Отвечает за разработку алгоритмов анализа и рекомендаций.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          {/* Frontend Developer */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-muted mb-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark opacity-10"></div>
            </div>
            <h3 className="text-xl font-semibold">Дмитрий Васильев</h3>
            <p className="text-muted-foreground mb-2">Ведущий Frontend-разработчик</p>
            <p className="text-sm text-center mb-4 max-w-xs">
              Специализируется на создании интуитивных интерфейсов с использованием современных технологий и фреймворков.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          {/* Backend Developer */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-muted mb-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark opacity-10"></div>
            </div>
            <h3 className="text-xl font-semibold">Андрей Петров</h3>
            <p className="text-muted-foreground mb-2">Ведущий Backend-разработчик</p>
            <p className="text-sm text-center mb-4 max-w-xs">
              Эксперт по высоконагруженным системам и обработке данных. Отвечает за серверную часть платформы и API.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          {/* UX Designer */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-muted mb-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark opacity-10"></div>
            </div>
            <h3 className="text-xl font-semibold">Ольга Смирнова</h3>
            <p className="text-muted-foreground mb-2">UX/UI Дизайнер</p>
            <p className="text-sm text-center mb-4 max-w-xs">
              Креативный дизайнер с опытом разработки пользовательских интерфейсов для аналитических систем и SEO-инструментов.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Team;

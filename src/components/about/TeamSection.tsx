
import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import TeamMember from './TeamMember';

const TeamSection = () => {
  return (
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
  );
};

export default TeamSection;

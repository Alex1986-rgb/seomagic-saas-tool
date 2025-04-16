
import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface FeatureTemplateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const FeatureTemplate: React.FC<FeatureTemplateProps> = ({
  title,
  description,
  icon,
  content
}) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <Link to="/features" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к функциям
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            {icon}
          </div>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>

        <div className="prose max-w-none">
          {content}
        </div>
      </motion.div>
    </div>
  );
};

export default FeatureTemplate;

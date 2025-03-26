
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <motion.div
    whileHover={{ 
      y: -5, 
      rotateX: 5,
      rotateY: 5,
      transition: { duration: 0.2 } 
    }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    style={{ perspective: 1000 }}
  >
    <Card className="relative overflow-hidden border border-border/20 shadow-sm bg-background/50 backdrop-blur-sm rounded-lg h-full hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-8 relative z-10">
        <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-all duration-300 icon-3d float-3d glow-effect">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground font-playfair">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  </motion.div>
);

export default FeatureCard;


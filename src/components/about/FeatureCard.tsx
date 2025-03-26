
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
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <Card className="relative overflow-hidden border border-border/20 shadow-sm bg-white rounded-sm h-full hover:shadow-md transition-all duration-300 group">
      <CardContent className="p-8 relative z-10">
        <div className="mb-6 inline-flex p-4 rounded-sm bg-secondary/80 text-primary group-hover:bg-secondary transition-all duration-300">{icon}</div>
        <h3 className="text-xl font-semibold mb-3 text-foreground font-playfair">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </CardContent>
    </Card>
  </motion.div>
);

export default FeatureCard;

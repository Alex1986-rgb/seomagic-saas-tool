
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
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <Card className="relative overflow-hidden border-none shadow-lg h-full premium-card group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardContent className="p-8 relative z-10">
        <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300">{icon}</div>
        <h3 className="text-xl font-semibold mb-3 text-foreground font-playfair">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default FeatureCard;

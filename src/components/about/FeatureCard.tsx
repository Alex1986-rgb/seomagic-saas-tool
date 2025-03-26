
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
    <Card className="relative overflow-hidden border-none shadow-lg h-full bg-gradient-to-br from-card to-background">
      <CardContent className="p-8">
        <div className="mb-6 inline-flex p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default FeatureCard;

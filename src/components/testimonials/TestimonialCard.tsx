
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  icon: React.ReactNode;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role, icon }) => (
  <motion.div 
    className="tanks-card p-6 h-full relative border border-primary/20"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ y: -10 }}
  >
    <div className="absolute top-0 left-0 w-[40px] h-[40px] border-t border-l border-primary/40 -mt-px -ml-px" />
    <div className="absolute top-0 right-0 w-[40px] h-[40px] border-t border-r border-primary/40 -mt-px -mr-px" />
    <div className="absolute bottom-0 left-0 w-[40px] h-[40px] border-b border-l border-primary/40 -mb-px -ml-px" />
    <div className="absolute bottom-0 right-0 w-[40px] h-[40px] border-b border-r border-primary/40 -mb-px -mr-px" />
    
    <div className="mb-4 flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className="h-5 w-5 text-primary fill-primary"
        />
      ))}
    </div>
    <div className="mb-4 text-primary/60 absolute top-4 right-4">
      {icon || <Quote className="w-10 h-10" />}
    </div>
    <div className="mt-6 mb-6 text-lg text-foreground/90">{quote}</div>
    <div className="border-t border-primary/10 pt-4 mt-auto">
      <p className="font-medium font-playfair">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </motion.div>
);

export default TestimonialCard;

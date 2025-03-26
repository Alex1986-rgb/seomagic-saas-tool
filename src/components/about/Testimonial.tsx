
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  company: string;
  rating?: number;
}

const Testimonial = ({ quote, author, company, rating = 5 }: TestimonialProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <Card className="overflow-hidden border-none shadow-lg h-full neo-glass group">
      <CardContent className="p-8">
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
            />
          ))}
        </div>
        <div className="mb-6 text-6xl text-primary/20 group-hover:text-primary/30 transition-colors duration-300">
          <Quote />
        </div>
        <p className="text-lg mb-6 text-foreground font-medium">{quote}</p>
        <Separator className="mb-6" />
        <div>
          <p className="font-playfair font-semibold text-lg">{author}</p>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default Testimonial;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TestimonialProps {
  quote: string;
  author: string;
  company: string;
}

const Testimonial = ({ quote, author, company }: TestimonialProps) => (
  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
    <CardContent className="p-8">
      <div className="mb-6 text-6xl text-primary/20">"</div>
      <p className="text-lg mb-6 text-foreground">{quote}</p>
      <Separator className="mb-6" />
      <div>
        <p className="font-semibold text-lg">{author}</p>
        <p className="text-sm text-muted-foreground">{company}</p>
      </div>
    </CardContent>
  </Card>
);

export default Testimonial;

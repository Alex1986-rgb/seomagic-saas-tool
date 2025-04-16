
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureBenefitsProps {
  benefits: string[];
}

const FeatureBenefits: React.FC<FeatureBenefitsProps> = ({ benefits }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Преимущества</h3>
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <Check size={16} className="mt-1 mr-2 text-primary" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        
        <Button className="w-full mt-8">Попробовать бесплатно</Button>
      </CardContent>
    </Card>
  );
};

export default FeatureBenefits;

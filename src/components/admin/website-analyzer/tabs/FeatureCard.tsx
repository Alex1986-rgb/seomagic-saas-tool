
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon,
  iconColor,
  title,
  description 
}) => {
  return (
    <div className="space-y-2">
      <h3 className={`text-base font-bold ${iconColor} flex gap-2 items-center`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
        {title}
      </h3>
      <p className="text-xs text-[#aebbf7]">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;

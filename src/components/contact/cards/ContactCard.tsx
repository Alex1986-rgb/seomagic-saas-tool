
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const ContactCard = ({ icon: Icon, title, subtitle, children }: ContactCardProps) => {
  return (
    <Card className="neo-card">
      <CardContent className="p-6 flex items-start">
        <div className="bg-primary/10 p-3 rounded-full mr-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm mb-2">{subtitle}</p>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;

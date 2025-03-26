
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TeamMemberProps {
  name: string;
  position: string;
  bio: string;
  image: string;
}

const TeamMember = ({ name, position, bio, image }: TeamMemberProps) => (
  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
    <CardContent className="p-0">
      <div className="relative overflow-hidden">
        <div className="aspect-square">
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-primary mb-2">{position}</p>
        <p className="text-muted-foreground text-sm">{bio}</p>
      </div>
    </CardContent>
  </Card>
);

export default TeamMember;

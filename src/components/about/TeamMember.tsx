
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Linkedin, Mail, ExternalLink } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  position: string;
  bio: string;
  image: string;
}

const TeamMember = ({ name, position, bio, image }: TeamMemberProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -10, transition: { duration: 0.3 } }}
  >
    <Card className="overflow-hidden border-none shadow-lg transition-all duration-300 group h-full">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <div className="aspect-square">
            <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Mail size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-playfair font-semibold">{name}</h3>
          <p className="text-primary mb-2">{position}</p>
          <p className="text-muted-foreground text-sm">{bio}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default TeamMember;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Linkedin, Mail, ExternalLink } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

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
    whileHover={{ 
      y: -10,
      rotateX: 5,
      rotateY: 5,
      transition: { duration: 0.3 } 
    }}
    style={{ perspective: 1000 }}
    className="icon-3d"
  >
    <Card className="overflow-hidden border-none shadow-lg transition-all duration-300 group bg-background/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <div className="aspect-square">
            <OptimizedImage src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6 backdrop-blur-sm">
            <div className="flex gap-4">
              {['linkedin', 'mail', 'external-link'].map((icon, index) => (
                <motion.a
                  key={icon}
                  href="#"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors icon-3d float-3d"
                  whileHover={{ scale: 1.1, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {icon === 'linkedin' && <Linkedin size={18} />}
                  {icon === 'mail' && <Mail size={18} />}
                  {icon === 'external-link' && <ExternalLink size={18} />}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">{name}</h3>
          <p className="text-primary mb-2">{position}</p>
          <p className="text-muted-foreground text-sm">{bio}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default TeamMember;


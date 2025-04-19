
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Guide } from '@/types/guides';
import GuideImageSlider from './GuideImageSlider';

interface GuideCardProps {
  guide: Guide;
  index: number;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col overflow-hidden">
        <GuideImageSlider guide={guide} />
        
        <div className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-2 py-1 rounded-full z-10">
          {guide.level}
        </div>
        
        <CardHeader>
          <div className="text-sm text-primary mb-2 flex items-center">
            <span>{guide.category}</span>
            <div className="ml-auto flex items-center text-muted-foreground text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span>{guide.duration}</span>
            </div>
          </div>
          <CardTitle className="text-xl line-clamp-2">{guide.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">{guide.description}</p>
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to={`/guides/${guide.id}`} className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-primary" />
              <span>Читать руководство</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default GuideCard;

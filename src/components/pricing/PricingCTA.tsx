
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Calendar, CheckCircle, Sparkles } from 'lucide-react';

const PricingCTA: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto mt-20"
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
        
        <CardContent className="relative p-8 md:p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-6"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Badge className="mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20">
              Остались вопросы?
            </Badge>
          </motion.div>

          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Получите персональную консультацию
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Наша команда поддержки готова помочь вам выбрать оптимальное решение для ваших задач и ответить на все вопросы
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Бесплатная консультация</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Персональный подход</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Быстрый ответ</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Button size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/contact">
                <MessageCircle className="mr-2 h-5 w-5" />
                Связаться с нами
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-white/20 text-foreground hover:bg-white/10" asChild>
              <Link to="/demo">
                <Calendar className="mr-2 h-5 w-5" />
                Запросить демо
              </Link>
            </Button>
          </motion.div>

          <motion.p 
            className="text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Ответим в течение 2 часов в рабочее время
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PricingCTA;

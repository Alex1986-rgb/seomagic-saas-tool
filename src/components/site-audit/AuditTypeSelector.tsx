import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Target, Lock, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuditTypeSelectorProps {
  onStartAudit: (type: 'quick' | 'deep') => void;
  isLoading: boolean;
  url: string;
}

export const AuditTypeSelector: React.FC<AuditTypeSelectorProps> = ({
  onStartAudit,
  isLoading,
  url
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDeepAudit = () => {
    if (!user.isLoggedIn) {
      navigate(`/auth?redirect=${encodeURIComponent(`/site-audit?url=${encodeURIComponent(url)}`)}`);
      return;
    }
    onStartAudit('deep');
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Quick Audit Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 px-3 py-1 bg-green-500/20 text-green-600 text-xs font-semibold rounded-bl-lg">
            БЕСПЛАТНО
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Быстрый аудит</CardTitle>
            </div>
            <CardDescription>
              Базовый анализ до 10 страниц без регистрации
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>До 10 страниц сайта</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Базовые SEO метрики</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Технический анализ</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Скачивание отчета PDF</span>
              </li>
            </ul>
            <Button 
              onClick={() => onStartAudit('quick')}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <Zap className="mr-2 h-4 w-4" />
              Запустить быстрый аудит
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Deep Audit Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="relative overflow-hidden border-2 border-primary/30 hover:border-primary transition-colors bg-gradient-to-br from-card to-primary/5">
          <div className="absolute top-0 right-0 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-bl-lg">
            ПРЕМИУМ
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Глубокий аудит</CardTitle>
            </div>
            <CardDescription>
              Полный анализ до 100+ страниц с детальными рекомендациями
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>До 100+ страниц сайта</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Расширенный SEO анализ</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Детальные рекомендации</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>История аудитов</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Приоритизация проблем</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Экспорт в Excel и JSON</span>
              </li>
            </ul>
            <Button 
              onClick={handleDeepAudit}
              disabled={isLoading}
              className="w-full"
              size="lg"
              variant="default"
            >
              {!user.isLoggedIn && <Lock className="mr-2 h-4 w-4" />}
              <Target className="mr-2 h-4 w-4" />
              {user.isLoggedIn ? 'Запустить глубокий аудит' : 'Войти и запустить'}
            </Button>
            {!user.isLoggedIn && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Требуется регистрация
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

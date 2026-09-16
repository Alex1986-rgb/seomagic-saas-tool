import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Target, Lock, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuditTypeSelectorProps {
  onStartAudit: (type: 'quick' | 'deep', maxPages: number) => void;
  isLoading: boolean;
  url: string;
}

/**
 * Сколько страниц обходить. Число решает, сколько времени займёт проверка:
 * двадцать страниц — минута, три сотни — заметно дольше.
 */
const PAGE_LIMITS = [
  { value: '10', label: '10 страниц — быстрее всего' },
  { value: '20', label: '20 страниц' },
  { value: '50', label: '50 страниц' },
  { value: '100', label: '100 страниц' },
  { value: '300', label: '300 страниц — дольше' },
];

export const AuditTypeSelector: React.FC<AuditTypeSelectorProps> = ({
  onStartAudit,
  isLoading,
  url
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [maxPages, setMaxPages] = React.useState('20');

  const handleDeepAudit = () => {
    if (!user.isLoggedIn) {
      navigate(`/auth?redirect=${encodeURIComponent(`/site-audit?url=${encodeURIComponent(url)}`)}`);
      return;
    }
    onStartAudit('deep', Number(maxPages));
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
              Базовый анализ без регистрации — глубину выбираете сами
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Столько страниц, сколько укажете</span>
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
            <div className="mb-4 space-y-1.5">
              <Label htmlFor="page-limit" className="text-xs text-muted-foreground">
                Сколько страниц проверить
              </Label>
              <Select value={maxPages} onValueChange={setMaxPages}>
                <SelectTrigger id="page-limit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_LIMITS.map((limit) => (
                    <SelectItem key={limit.value} value={limit.value}>{limit.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => onStartAudit('quick', Number(maxPages))}
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

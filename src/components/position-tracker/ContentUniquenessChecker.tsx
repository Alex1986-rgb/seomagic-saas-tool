
import React, { useState } from 'react';
import { Check, CopyCheck, Fingerprint, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ContentUniquenessCheckerProps {
  className?: string;
}

export function ContentUniquenessChecker({ className }: ContentUniquenessCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [uniquenessScore, setUniquenessScore] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const checkUniqueness = async () => {
    if (!content && !url) {
      toast({
        title: "Ошибка",
        description: "Введите текст или URL страницы для проверки уникальности",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setProgress(0);
    setUniquenessScore(null);

    try {
      // Здесь в реальном приложении был бы настоящий запрос к API
      // Для демо эмулируем процесс проверки
      for (let i = 1; i <= 10; i++) {
        setProgress(i * 10);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Генерируем случайную оценку уникальности для демо
      // В реальном приложении здесь был бы результат проверки от API
      const score = Math.floor(Math.random() * 31) + 70; // От 70 до 100%
      setUniquenessScore(score);
      
      toast({
        title: "Проверка завершена",
        description: `Уникальность контента: ${score}%`,
      });
    } catch (error) {
      console.error('Ошибка при проверке уникальности:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить проверку уникальности",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 95) return 'Высокая уникальность - отличный результат!';
    if (score >= 80) return 'Хорошая уникальность - подходит для большинства сайтов';
    if (score >= 60) return 'Средняя уникальность - может потребоваться доработка контента';
    return 'Низкая уникальность - рекомендуется переработать текст';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-primary" />
            Проверка уникальности контента
          </CardTitle>
          <CardDescription>
            Анализирует текст на уникальность и выявляет возможные проблемы с дублированием контента
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-1">URL страницы (опционально)</label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Введите URL страницы для проверки"
              disabled={isChecking}
            />
            <div className="text-xs text-muted-foreground mt-1">
              Или вставьте текст для проверки ниже
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">Текст для проверки</label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Вставьте текст, который нужно проверить на уникальность"
              rows={6}
              disabled={isChecking}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={checkUniqueness} 
              disabled={isChecking || (!content && !url)}
              className="gap-2"
            >
              {isChecking ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CopyCheck className="h-4 w-4" />
              )}
              {isChecking ? 'Проверяем...' : 'Проверить уникальность'}
            </Button>
          </div>

          {isChecking && (
            <div className="mt-4">
              <div className="text-sm mb-1">Прогресс проверки: {progress}%</div>
              <div className="w-full h-2 bg-secondary rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {uniquenessScore !== null && (
            <div className="mt-4 border rounded-lg p-4">
              <div className="text-lg font-semibold mb-2">Результат проверки:</div>
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className={`text-2xl font-bold ${getScoreColor(uniquenessScore)}`}
                >
                  {uniquenessScore}%
                </div>
                <div className="text-sm">уникальности</div>
              </div>
              <div className="text-sm text-muted-foreground">{getScoreDescription(uniquenessScore)}</div>
              
              <div className="mt-4">
                <div className="text-sm font-medium mb-1">Рекомендации:</div>
                <ul className="text-sm space-y-1">
                  {uniquenessScore < 80 && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-amber-500" />
                      <span>Переработайте наименее уникальные части текста</span>
                    </li>
                  )}
                  {uniquenessScore < 60 && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-amber-500" />
                      <span>Добавьте больше оригинального содержания</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-green-500" />
                    <span>Используйте уникальные заголовки и описания</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-green-500" />
                    <span>Регулярно проверяйте контент на уникальность</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

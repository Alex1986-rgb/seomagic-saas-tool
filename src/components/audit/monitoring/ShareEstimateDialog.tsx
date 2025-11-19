import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Copy, Check, Loader2, Lock } from 'lucide-react';
import { OptimizationItem } from '@/types/audit/optimization-types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ShareEstimateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: OptimizationItem[];
  totals: {
    subtotal: number;
    discount: number;
    final: number;
  };
  url: string;
  auditId?: string;
}

const ShareEstimateDialog: React.FC<ShareEstimateDialogProps> = ({
  isOpen,
  onOpenChange,
  items,
  totals,
  url,
  auditId
}) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Options
  const [expiresIn, setExpiresIn] = useState<string>('30');
  const [maxViews, setMaxViews] = useState<string>('unlimited');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');

  const handleCreateShareLink = async () => {
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calculate expiry date
      let expiresAt = null;
      if (expiresIn !== 'unlimited') {
        const days = parseInt(expiresIn);
        expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      }

      // Hash password if provided
      let passwordHash = null;
      if (passwordProtected && password) {
        // Simple hash - in production use bcrypt or similar
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        passwordHash = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      }

      const { data, error } = await supabase
        .from('shared_estimates')
        .insert([{
          user_id: user.id,
          audit_id: auditId || null,
          estimate_data: items as any,
          totals: totals as any,
          url,
          expires_at: expiresAt,
          password_hash: passwordHash,
          max_views: maxViews === 'unlimited' ? null : parseInt(maxViews)
        }])
        .select('share_token')
        .single();

      if (error) throw error;

      const baseUrl = window.location.origin;
      const generatedUrl = `${baseUrl}/shared-estimate/${data.share_token}`;
      setShareUrl(generatedUrl);

      toast({
        title: 'Ссылка создана',
        description: 'Публичная ссылка на смету успешно создана'
      });
    } catch (error) {
      console.error('Error creating share link:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать публичную ссылку',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: 'Скопировано',
        description: 'Ссылка скопирована в буфер обмена'
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleClose = () => {
    setShareUrl(null);
    setPassword('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Поделиться сметой
          </DialogTitle>
          <DialogDescription>
            Создайте публичную ссылку для просмотра сметы
          </DialogDescription>
        </DialogHeader>

        {!shareUrl ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Срок действия</Label>
              <Select value={expiresIn} onValueChange={setExpiresIn}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 дней</SelectItem>
                  <SelectItem value="30">30 дней</SelectItem>
                  <SelectItem value="90">90 дней</SelectItem>
                  <SelectItem value="unlimited">Без ограничений</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Максимум просмотров</Label>
              <Select value={maxViews} onValueChange={setMaxViews}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 просмотров</SelectItem>
                  <SelectItem value="50">50 просмотров</SelectItem>
                  <SelectItem value="100">100 просмотров</SelectItem>
                  <SelectItem value="unlimited">Без ограничений</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Защита паролем</Label>
                <p className="text-xs text-muted-foreground">
                  Требовать пароль для просмотра
                </p>
              </div>
              <Switch
                checked={passwordProtected}
                onCheckedChange={setPasswordProtected}
              />
            </div>

            {passwordProtected && (
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleCreateShareLink}
              disabled={isCreating || (passwordProtected && !password)}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Создание...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Создать ссылку
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Публичная ссылка</Label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
              <p className="font-medium">Настройки доступа:</p>
              <p className="text-muted-foreground">
                • Срок действия: {expiresIn === 'unlimited' ? 'Бессрочно' : `${expiresIn} дней`}
              </p>
              <p className="text-muted-foreground">
                • Просмотров: {maxViews === 'unlimited' ? 'Неограничено' : maxViews}
              </p>
              {passwordProtected && (
                <p className="text-muted-foreground">• Защищено паролем</p>
              )}
            </div>

            <Button onClick={handleClose} className="w-full">
              Готово
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareEstimateDialog;
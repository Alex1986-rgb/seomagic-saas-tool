
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Save } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/** Короче не принимаем: проверяем до запроса, чтобы не гонять заведомо плохой пароль. */
const MIN_PASSWORD_LENGTH = 8;

/**
 * Смена пароля.
 *
 * Раньше кнопка «Обновить пароль» не была ни к чему подключена: человек вводил
 * новый пароль, нажимал кнопку и считал, что пароль сменён, хотя ничего не
 * происходило. Поле «Текущий пароль» тоже никто не проверял, поэтому его нет:
 * новый пароль задаётся для текущей сессии через supabase.auth.updateUser.
 */
const ClientPasswordTab: React.FC = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
      return;
    }
    if (password !== confirm) {
      setFormError('Пароли не совпадают');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setPassword('');
      setConfirm('');
      toast({
        title: 'Пароль обновлён',
        description: 'В следующий раз входите с новым паролем',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Попробуйте ещё раз';
      setFormError(`Не удалось сменить пароль: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="new-password">Новый пароль</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Не короче {MIN_PASSWORD_LENGTH} символов.
      </p>

      {formError && (
        <div className="flex items-center p-3 border border-destructive/30 bg-destructive/5 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 text-destructive" />
          <span>{formError}</span>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" className="gap-2" disabled={saving || !password || !confirm}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{saving ? 'Сохранение...' : 'Обновить пароль'}</span>
        </Button>
      </div>
    </form>
  );
};

export default ClientPasswordTab;

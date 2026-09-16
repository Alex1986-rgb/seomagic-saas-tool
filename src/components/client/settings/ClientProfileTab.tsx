
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/services/auth/authService';

/**
 * Основные данные профиля.
 *
 * Раньше поля были заполнены чужими данными («Иван Петров», ivan@example.com,
 * «ООО Техно», телефон, текст «О себе»), а «Сохранить изменения» ничего не
 * делала. В таблице profiles из этого есть только имя и почта, поэтому
 * остались они: имя читается из базы и сохраняется туда же, почта — адрес
 * входа, её показываем без правки.
 */
const ClientProfileTab: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const userId = user.user?.id;
  const email = user.user?.email ?? user.profile?.email ?? '';

  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Не удалось загрузить профиль:', error);
          setLoadError(error.message);
        } else {
          setFullName(data?.full_name ?? '');
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile({ full_name: fullName.trim() });
      if (error) throw error;

      await refreshUser();
      toast({
        title: 'Профиль сохранён',
        description: 'Имя обновлено',
      });
    } catch (error) {
      toast({
        title: 'Не удалось сохранить профиль',
        description: error instanceof Error ? error.message : 'Попробуйте ещё раз',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Загружаем профиль...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loadError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          Не удалось загрузить профиль: {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="profile-full-name">Имя</Label>
          <Input
            id="profile-full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Как к вам обращаться"
            maxLength={120}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" value={email} type="email" readOnly disabled />
          <p className="text-xs text-muted-foreground">
            Адрес, с которым вы входите. Сменить его здесь пока нельзя.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleSave} disabled={saving || !!loadError}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{saving ? 'Сохранение...' : 'Сохранить изменения'}</span>
        </Button>
      </div>
    </div>
  );
};

export default ClientProfileTab;

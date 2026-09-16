
import React, { useEffect, useState } from 'react';
import { User, Settings, CreditCard, FileText, Bell, History, BarChart, Globe, ShieldCheck } from 'lucide-react';
import ProfileNavButton from './ProfileNavButton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * Боковая панель кабинета.
 *
 * Здесь были вписаны чужие данные: «Иван Петров», значки «Pro план» и
 * «Активен», «Участник с Мая 2023» и красный счётчик «3» у уведомлений. Любой
 * вошедший видел их как свои, хотя оплаты и тарифов нет. Теперь имя и почта
 * берутся из профиля, дата — из даты создания аккаунта, а счётчик — из
 * непрочитанных уведомлений в базе.
 */
const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();
  const userId = user.user?.id;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)
      .then(({ count, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Не удалось посчитать непрочитанные уведомления:', error);
          return;
        }
        setUnreadCount(count ?? 0);
      });

    return () => { cancelled = true; };
  }, [userId]);

  const email = user.profile?.email || user.user?.email || '';
  const displayName = user.profile?.full_name?.trim() || email || 'Мой аккаунт';
  const createdAt = user.profile?.created_at;
  const createdLabel = createdAt
    ? new Date(createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="md:col-span-1 mb-6 md:mb-0">
      <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 p-4 md:p-6 text-center mb-4 md:mb-6 shadow-sm">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
          <User className="h-8 w-8 md:h-12 md:w-12 text-primary" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold break-words">{displayName}</h3>
        {email && email !== displayName && (
          <p className="text-xs md:text-sm text-muted-foreground mt-1 break-all">{email}</p>
        )}
        {user.isAdmin && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
              Администратор
            </Badge>
          </div>
        )}
        {createdLabel && (
          <p className="text-xs md:text-sm text-muted-foreground mt-2">Аккаунт создан {createdLabel}</p>
        )}
        {user.loadError && (
          <p className="text-xs text-destructive mt-2">{user.loadError}</p>
        )}

        <div className="mt-4 grid grid-cols-1 gap-2">
          <Link to="/position-tracker">
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2 text-xs md:text-sm py-1 md:py-2">
              <Globe className="h-3 w-3 md:h-4 md:w-4" />
              <span>Анализ позиций</span>
            </Button>
          </Link>
          <Link to="/audit">
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2 text-xs md:text-sm py-1 md:py-2">
              <History className="h-3 w-3 md:h-4 md:w-4" />
              <span>Запустить аудит</span>
            </Button>
          </Link>
        </div>
      </Card>

      <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 p-2 md:p-4 shadow-sm">
        <nav className="space-y-1">
          <ProfileNavButton
            active={activeTab === 'audits'}
            icon={<History size={16} />}
            onClick={() => onTabChange('audits')}
            className="text-xs md:text-sm py-2"
          >
            История аудитов
          </ProfileNavButton>
          <ProfileNavButton
            active={activeTab === 'positions'}
            icon={<BarChart size={16} />}
            onClick={() => onTabChange('positions')}
            badge={<Badge className="ml-1 bg-primary text-[10px] md:text-xs py-0 px-1 md:px-2">Новое</Badge>}
            className="text-xs md:text-sm py-2"
          >
            Позиции сайта
          </ProfileNavButton>
          <ProfileNavButton
            active={activeTab === 'reports'}
            icon={<FileText size={16} />}
            onClick={() => onTabChange('reports')}
            className="text-xs md:text-sm py-2"
          >
            Отчеты
          </ProfileNavButton>
          <ProfileNavButton
            active={activeTab === 'subscription'}
            icon={<CreditCard size={16} />}
            onClick={() => onTabChange('subscription')}
            className="text-xs md:text-sm py-2"
          >
            Подписка
          </ProfileNavButton>
          <ProfileNavButton
            active={activeTab === 'notifications'}
            icon={<Bell size={16} />}
            onClick={() => onTabChange('notifications')}
            badge={unreadCount > 0 ? (
              <Badge className="ml-1 bg-red-500 text-[10px] md:text-xs py-0 px-1 md:px-2">{unreadCount}</Badge>
            ) : undefined}
            className="text-xs md:text-sm py-2"
          >
            Уведомления
          </ProfileNavButton>
          <ProfileNavButton
            active={activeTab === 'settings'}
            icon={<Settings size={16} />}
            onClick={() => onTabChange('settings')}
            className="text-xs md:text-sm py-2"
          >
            Настройки
          </ProfileNavButton>
          <ProfileNavButton
            active={activeTab === 'security'}
            icon={<ShieldCheck size={16} />}
            onClick={() => onTabChange('security')}
            className="text-xs md:text-sm py-2"
          >
            Безопасность
          </ProfileNavButton>
        </nav>
      </Card>
    </div>
  );
};

export default ProfileSidebar;

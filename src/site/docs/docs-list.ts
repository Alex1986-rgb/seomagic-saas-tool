import { Contact, Cookie, FileText, Info, Lock, Map as MapIcon, RotateCcw, Shield, type LucideIcon } from 'lucide-react';

export type DocId = 'about' | 'contacts' | 'offer' | 'privacy' | 'cookie' | 'refund' | 'security' | 'sitemap';

export interface DocEntry {
  id: DocId;
  to: string;
  label: string;
  icon: LucideIcon;
}

/** Порядок = порядок в оглавлении макета. Карта сайта берёт этот же список. */
export const DOCS: DocEntry[] = [
  { id: 'about', to: '/about', label: 'О сервисе', icon: Info },
  { id: 'contacts', to: '/contact', label: 'Контакты и реквизиты', icon: Contact },
  { id: 'offer', to: '/oferta', label: 'Публичная оферта', icon: FileText },
  { id: 'privacy', to: '/privacy', label: 'Политика конфиденциальности', icon: Shield },
  { id: 'cookie', to: '/cookie', label: 'Обработка cookie', icon: Cookie },
  { id: 'refund', to: '/vozvrat', label: 'Возврат и гарантии', icon: RotateCcw },
  { id: 'security', to: '/bezopasnost', label: 'Безопасность и доступы', icon: Lock },
  { id: 'sitemap', to: '/sitemap', label: 'Карта сайта', icon: MapIcon },
];

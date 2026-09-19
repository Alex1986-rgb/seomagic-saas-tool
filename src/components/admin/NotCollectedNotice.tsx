import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface NotCollectedNoticeProps {
  title: string;
  description: string;
  /** Что именно не измеряется — списком, чтобы не гадать по тексту. */
  items?: string[];
  className?: string;
}

/**
 * Честная заглушка на месте показателей, которых платформа не собирает.
 *
 * Появилась вместо блоков с выдуманными цифрами: лучше прямо сказать, что
 * данных нет, чем показывать владельцу сервиса красивый график ни о чём.
 */
const NotCollectedNotice: React.FC<NotCollectedNoticeProps> = ({
  title,
  description,
  items,
  className,
}) => (
  <Alert className={className}>
    <Info className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>
      <p>{description}</p>
      {items && items.length > 0 && (
        <ul className="list-disc pl-5 mt-2 space-y-1">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </AlertDescription>
  </Alert>
);

export default NotCollectedNotice;

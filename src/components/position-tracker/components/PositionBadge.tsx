
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface PositionBadgeProps {
  position: number;
  previousPosition?: number;
  showChange?: boolean;
  showText?: boolean;
}

export const PositionBadge: React.FC<PositionBadgeProps> = ({ 
  position, 
  previousPosition,
  showChange = true,
  showText = false
}) => {
  // Если позиция не найдена (0)
  if (position === 0) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700">
        {showText ? 'не найден' : '-'}
      </Badge>
    );
  }
  
  // Определяем класс в зависимости от позиции
  let badgeClass = '';
  if (position <= 3) {
    badgeClass = "bg-green-100 text-green-800";
  } else if (position <= 10) {
    badgeClass = "bg-green-50 text-green-700";
  } else if (position <= 30) {
    badgeClass = "bg-yellow-50 text-yellow-700";
  } else if (position <= 100) {
    badgeClass = "bg-gray-50 text-gray-700";
  } else {
    badgeClass = "bg-gray-50 text-gray-700";
  }
  
  // Если есть предыдущая позиция и мы хотим показать изменение
  if (previousPosition && showChange) {
    const change = previousPosition - position;
    
    return (
      <div className="flex items-center gap-1">
        <Badge variant="outline" className={badgeClass}>
          {position}
        </Badge>
        
        {change !== 0 && (
          <span className={`text-xs ${
            change > 0 
              ? 'text-green-600 flex items-center' 
              : change < 0 
                ? 'text-red-600 flex items-center' 
                : 'text-gray-600 flex items-center'
          }`}>
            {change > 0 ? (
              <>
                <ArrowUp className="w-3 h-3" />
                {Math.abs(change)}
              </>
            ) : change < 0 ? (
              <>
                <ArrowDown className="w-3 h-3" />
                {Math.abs(change)}
              </>
            ) : (
              <Minus className="w-3 h-3" />
            )}
          </span>
        )}
      </div>
    );
  }
  
  // Если нет предыдущей позиции или не нужно показывать изменение
  return (
    <Badge variant="outline" className={badgeClass}>
      {position}
    </Badge>
  );
};

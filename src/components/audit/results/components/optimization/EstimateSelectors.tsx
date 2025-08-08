
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export interface EstimateGroupItem {
  key: string;
  label: string;
  description?: string;
  selected: boolean;
  disabled?: boolean;
}

interface EstimateSelectorsProps {
  groups: Array<{ title: string; items: EstimateGroupItem[] }>;
  onToggle: (key: string, selected: boolean) => void;
  className?: string;
}

const EstimateSelectors: React.FC<EstimateSelectorsProps> = ({ groups, onToggle, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {groups.map((group) => (
        <section key={group.title}>
          <h3 className="text-base font-semibold mb-3">{group.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {group.items.map((item) => (
              <Card
                key={item.key}
                className={`flex items-start gap-3 p-4 cursor-pointer transition-shadow hover:shadow-sm ${
                  item.disabled ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                onClick={() => !item.disabled && onToggle(item.key, !item.selected)}
                aria-disabled={item.disabled}
              >
                <Checkbox
                  checked={item.selected}
                  onCheckedChange={(checked) => !item.disabled && onToggle(item.key, Boolean(checked))}
                  aria-label={item.label}
                />
                <div>
                  <div className="font-medium leading-tight">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default EstimateSelectors;

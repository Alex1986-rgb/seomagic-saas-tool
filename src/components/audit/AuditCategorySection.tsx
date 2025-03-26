
import React from 'react';

interface AuditCategoryItemProps {
  id: string;
  title: string;
  description?: string;
  value?: string;
  status: 'good' | 'warning' | 'error';
}

interface AuditCategorySectionProps {
  title: string;
  score: number;
  items: AuditCategoryItemProps[];
  description?: string;
}

const AuditCategorySection: React.FC<AuditCategorySectionProps> = ({
  title,
  score,
  items,
  description,
}) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'text-green-500 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'error': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'good': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return '•';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="text-2xl font-bold">
          <span className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'}>
            {score}
          </span>
          <span className="text-muted-foreground">/100</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`p-4 border rounded-lg ${getStatusColor(item.status)}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="inline-block w-6 h-6 text-center mr-3">
                  {getStatusIcon(item.status)}
                </span>
                <h3 className="font-medium">{item.title}</h3>
              </div>
              {item.value && <div className="font-mono">{item.value}</div>}
            </div>
            {item.description && (
              <p className="mt-2 ml-9">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditCategorySection;

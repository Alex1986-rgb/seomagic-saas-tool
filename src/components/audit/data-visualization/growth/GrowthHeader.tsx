
import React from 'react';

const GrowthHeader: React.FC = () => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold mb-2">Рост показателей после оптимизации</h2>
      <p className="text-muted-foreground">
        Визуализация изменений ключевых метрик до и после выполнения рекомендаций
      </p>
    </div>
  );
};

export default GrowthHeader;

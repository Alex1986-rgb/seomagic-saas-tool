
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Feature } from './types';
import FeatureCard from './FeatureCard';

interface SortableFeatureItemProps {
  feature: Feature;
  onUpdate: (id: string, field: string, value: string | boolean) => void;
  onRemove: (id: string) => void;
}

export const SortableFeatureItem: React.FC<SortableFeatureItemProps> = ({
  feature,
  onUpdate,
  onRemove
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({ id: feature.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 250ms ease',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <FeatureCard
        feature={feature}
        onUpdate={onUpdate}
        onRemove={onRemove}
        dragHandleProps={listeners}
      />
    </div>
  );
};

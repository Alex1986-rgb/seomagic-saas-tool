
import React from 'react';
import { SlideData } from './types';
import BarChart from './BarChart';
import BubbleChart from './BubbleChart';
import CircularChart from './CircularChart';

interface SlideVisualizationProps {
  currentSlide: number;
  slideData: SlideData;
}

const SlideVisualization: React.FC<SlideVisualizationProps> = ({ currentSlide, slideData }) => {
  switch (currentSlide % 3) {
    case 0: 
      return <BarChart slideData={slideData} currentSlide={currentSlide} />;
    case 1:
      return <BubbleChart slideData={slideData} />;
    default:
      return <CircularChart slideData={slideData} />;
  }
};

export default SlideVisualization;


import React, { useEffect, useRef } from 'react';

interface StarProps {
  groupCount?: number;
  starsPerGroup?: number;
  maxSize?: number;
}

const StarryBackground: React.FC<StarProps> = ({
  groupCount = 5,
  starsPerGroup = 40,
  maxSize = 4
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing stars
    const existingGroups = containerRef.current.querySelectorAll('.star-group');
    existingGroups.forEach(group => group.remove());
    
    // Create star groups
    for (let g = 1; g <= groupCount; g++) {
      const group = document.createElement('div');
      group.className = `star-group star-group-${g}`;
      
      // Create stars for this group (without text content)
      for (let i = 0; i < starsPerGroup; i++) {
        const star = document.createElement('div');
        const size = Math.ceil(Math.random() * maxSize);
        star.className = `star star-size-${size}`;
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Add to group
        group.appendChild(star);
      }
      
      // Add group to container
      containerRef.current.appendChild(group);
    }
  }, [groupCount, starsPerGroup, maxSize]);
  
  return <div ref={containerRef} className="stars-container" />;
};

export default StarryBackground;

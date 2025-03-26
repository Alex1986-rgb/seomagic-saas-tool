
import React, { useEffect, useRef } from 'react';

interface StarProps {
  groupCount?: number;
  starsPerGroup?: number;
  maxSize?: number;
  shootingStarsCount?: number;
  includeNebula?: boolean;
}

const StarryBackground: React.FC<StarProps> = ({
  groupCount = 5,
  starsPerGroup = 50,
  maxSize = 4,
  shootingStarsCount = 3,
  includeNebula = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing stars
    const existingGroups = containerRef.current.querySelectorAll('.star-group, .shooting-star, .nebula');
    existingGroups.forEach(group => group.remove());
    
    // Create star groups
    for (let g = 1; g <= groupCount; g++) {
      const group = document.createElement('div');
      group.className = `star-group star-group-${g}`;
      
      // Create stars for this group
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
    
    // Add shooting stars
    for (let i = 0; i < shootingStarsCount; i++) {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      
      // Random starting position
      const randomTop = Math.random() * 60; // Keep in upper part of screen
      const randomLeft = 30 + Math.random() * 60; // Keep in middle-ish of screen
      shootingStar.style.top = `${randomTop}%`;
      shootingStar.style.left = `${randomLeft}%`;
      
      // Random animation delay
      const delay = Math.random() * 20;
      shootingStar.style.animationDelay = `${delay}s`;
      
      containerRef.current.appendChild(shootingStar);
    }
    
    // Add nebula clouds if enabled
    if (includeNebula) {
      for (let i = 1; i <= 3; i++) {
        const nebula = document.createElement('div');
        nebula.className = `nebula nebula-${i}`;
        containerRef.current.appendChild(nebula);
      }
    }
  }, [groupCount, starsPerGroup, maxSize, shootingStarsCount, includeNebula]);
  
  return <div ref={containerRef} className="stars-container" />;
};

export default StarryBackground;


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

    const container = containerRef.current;
    let cleanup: (() => void) | undefined;
    
    // Defer DOM manipulation to avoid blocking
    const createStars = () => {
      if (!container) return;
      
      // Clear existing content
      container.innerHTML = '';

      // Create star groups with different patterns
      for (let group = 0; group < groupCount; group++) {
        for (let i = 0; i < starsPerGroup; i++) {
          const star = document.createElement('div');
          star.className = 'star';
          
          // Position and style
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const size = Math.random() * maxSize + 1;
          const opacity = Math.random() * 0.8 + 0.2;
          
          star.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: white;
            border-radius: 50%;
            opacity: ${opacity};
            animation: twinkle ${2 + Math.random() * 3}s infinite;
          `;
          
          container.appendChild(star);
        }
      }

      // Add shooting stars
      for (let i = 0; i < shootingStarsCount; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.cssText = `
          position: absolute;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: shoot ${3 + Math.random() * 4}s infinite ${Math.random() * 5}s;
        `;
        container.appendChild(shootingStar);
      }

      // Add nebula effects
      if (includeNebula) {
        for (let i = 0; i < 3; i++) {
          const nebula = document.createElement('div');
          nebula.className = `nebula nebula-${i}`;
          nebula.style.cssText = `
            position: absolute;
            left: ${Math.random() * 80}%;
            top: ${Math.random() * 80}%;
            width: ${100 + Math.random() * 200}px;
            height: ${100 + Math.random() * 200}px;
            background: radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            animation: pulse ${8 + Math.random() * 4}s infinite ease-in-out;
          `;
          container.appendChild(nebula);
        }
      }
    };

    // Use RAF for smooth performance
    const raf = requestAnimationFrame(createStars);
    
    cleanup = () => {
      cancelAnimationFrame(raf);
      if (container) {
        container.innerHTML = '';
      }
    };
    
    return cleanup;
  }, [groupCount, starsPerGroup, maxSize, shootingStarsCount, includeNebula]);
  
  return <div ref={containerRef} className="stars-container" />;
};

export default StarryBackground;

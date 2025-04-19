
import React from 'react';

const SocialLinks = () => {
  return (
    <div className="mt-20 text-center">
      <h2 className="text-2xl font-bold mb-6">Следите за нами в социальных сетях</h2>
      <div className="flex justify-center space-x-4">
        {[1, 2, 3, 4].map((i) => (
          <a 
            key={i}
            href="#" 
            className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <span className="sr-only">Социальная сеть {i}</span>
            <div className="w-5 h-5 rounded-full bg-primary/50"></div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;

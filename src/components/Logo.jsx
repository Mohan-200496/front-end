
import React from 'react';

const Logo = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto flex items-center justify-center mb-6`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-full blur-sm"></div>
        <div className="relative bg-black/80 rounded-full p-4 border-2 border-gold-500 shadow-xl">
          <div className="text-gold-500 font-bold text-center leading-none">
            {size === 'sm' ? (
              <span className="text-2xl">S</span>
            ) : (
              <span className="text-3xl">STONKS</span>
            )}
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mt-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Logo;

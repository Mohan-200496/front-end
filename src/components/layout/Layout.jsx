import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Toaster } from '@/components/ui/sonner';

const Layout = ({ children }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // Set video as loaded after a small delay to prevent flickering
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Video background */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-20' : 'opacity-0'}`}
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src="/videos/roulette-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>
      
      {/* Animated background shapes with improved animation - keeping as subtle overlay */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gold-500/5 blur-3xl animate-blob" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gold-600/5 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-[60%] left-[60%] w-[40%] h-[40%] rounded-full bg-gold-700/5 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <Navbar />
      <main className="flex-1 relative">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export { Layout };

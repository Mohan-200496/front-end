
import React from 'react';
import { Navbar } from './Navbar';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Array of background images with different styles
  const backgroundImages = [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=80'
  ];

  // Randomly select a background image
  const randomBackground = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background image with gradient overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-10 -z-20 transition-all duration-1000 ease-in-out" 
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.9)), 
            url('${randomBackground}')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8) contrast(1.2)'
        }}
      />
      
      {/* Animated background shapes with improved animation */}
      <div className="fixed inset-0 overflow-hidden -z-20">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-[60%] left-[60%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <Navbar />
      <main className="flex-1 relative">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

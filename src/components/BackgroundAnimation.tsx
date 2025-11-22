import { useEffect, useRef } from 'react';

interface BackgroundAnimationProps {
  show: boolean;
}

const BackgroundAnimation = ({ show }: BackgroundAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !show) return;

    const container = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [show]);

  if (!show) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ opacity: show ? 1 : 0, transition: 'opacity 1s ease-in' }}
    >
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background opacity-60" />
      
      {/* Neural Network Lines - Horizontal flowing lines */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`neural-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-neural-flow"
          style={{
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
            opacity: 0.3,
          }}
        />
      ))}

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-primary rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
            opacity: 0.15,
          }}
        />
      ))}

      {/* Glowing Orbs */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full bg-primary/10 blur-3xl animate-glow-pulse"
          style={{
            width: `${150 + Math.random() * 200}px`,
            height: `${150 + Math.random() * 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${5 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
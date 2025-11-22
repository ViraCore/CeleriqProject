import { useEffect, useRef, useState } from 'react';

interface BackgroundAnimationProps {
  show: boolean;
}

interface Neuron {
  x: number;
  y: number;
  id: number;
}

interface Connection {
  from: Neuron;
  to: Neuron;
  active: boolean;
}

const BackgroundAnimation = ({ show }: BackgroundAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const animationFrameRef = useRef<number>();

  // Generate neuron network
  useEffect(() => {
    if (!show) return;

    const neuronCount = 25;
    const newNeurons: Neuron[] = [];
    
    // Create neurons in a grid-like pattern with some randomness
    for (let i = 0; i < neuronCount; i++) {
      newNeurons.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        id: i,
      });
    }

    setNeurons(newNeurons);

    // Create connections between nearby neurons
    const newConnections: Connection[] = [];
    const maxDistance = 20; // Maximum distance for connections

    for (let i = 0; i < newNeurons.length; i++) {
      for (let j = i + 1; j < newNeurons.length; j++) {
        const dx = newNeurons[i].x - newNeurons[j].x;
        const dy = newNeurons[i].y - newNeurons[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          newConnections.push({
            from: newNeurons[i],
            to: newNeurons[j],
            active: false,
          });
        }
      }
    }

    setConnections(newConnections);
  }, [show]);

  // Animate synapse firing
  useEffect(() => {
    if (!show || connections.length === 0) return;

    const interval = setInterval(() => {
      setConnections(prevConnections => {
        const newConnections = [...prevConnections];
        const randomIndex = Math.floor(Math.random() * newConnections.length);
        newConnections[randomIndex] = {
          ...newConnections[randomIndex],
          active: true,
        };

        // Deactivate after a short time
        setTimeout(() => {
          setConnections(current => {
            const updated = [...current];
            updated[randomIndex] = {
              ...updated[randomIndex],
              active: false,
            };
            return updated;
          });
        }, 800);

        return newConnections;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [show, connections.length]);

  // Canvas animation for organic brain patterns
  useEffect(() => {
    if (!show || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw organic flowing patterns
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const y = canvas.height / 2 + 
            Math.sin((x + time * 50 + i * 200) * 0.005) * 100 +
            Math.sin((x + time * 30 + i * 150) * 0.008) * 50;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      time++;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [show]);

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
      style={{ opacity: show ? 1 : 0, transition: 'opacity 1.5s ease-in' }}
    >
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background opacity-70" />
      
      {/* Organic Brain Pattern Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.6 }}
      />

      {/* Neural Network - Interconnected Neurons */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }}>
        {/* Draw connections */}
        {connections.map((conn, idx) => (
          <line
            key={`conn-${idx}`}
            x1={`${conn.from.x}%`}
            y1={`${conn.from.y}%`}
            x2={`${conn.to.x}%`}
            y2={`${conn.to.y}%`}
            stroke={conn.active ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}
            strokeWidth={conn.active ? '2' : '1'}
            strokeOpacity={conn.active ? '0.6' : '0.2'}
            style={{
              transition: 'all 0.3s ease-out',
            }}
          />
        ))}

        {/* Draw neurons */}
        {neurons.map((neuron) => (
          <g key={`neuron-${neuron.id}`}>
            {/* Outer glow */}
            <circle
              cx={`${neuron.x}%`}
              cy={`${neuron.y}%`}
              r="8"
              fill="hsl(var(--primary))"
              opacity="0.1"
              className="animate-glow-pulse"
              style={{
                animationDelay: `${neuron.id * 0.2}s`,
              }}
            />
            {/* Core */}
            <circle
              cx={`${neuron.x}%`}
              cy={`${neuron.y}%`}
              r="3"
              fill="hsl(var(--primary))"
              opacity="0.6"
            />
            {/* Center dot */}
            <circle
              cx={`${neuron.x}%`}
              cy={`${neuron.y}%`}
              r="1.5"
              fill="hsl(var(--accent))"
              opacity="0.9"
              className="animate-glow-pulse"
              style={{
                animationDelay: `${neuron.id * 0.15}s`,
              }}
            />
          </g>
        ))}
      </svg>

      {/* Stable Neural Flow Lines - Reduced glitchiness */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`neural-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          style={{
            top: `${10 + i * 12}%`,
            width: '100%',
            animation: 'stable-flow 8s ease-in-out infinite',
            animationDelay: `${i * 1}s`,
            opacity: 0.3,
          }}
        />
      ))}

      {/* Subtle Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: 'gentle-float 12s ease-in-out infinite',
            animationDelay: `${i * 0.8}s`,
            opacity: 0.3,
          }}
        />
      ))}

      {/* Soft Glowing Orbs */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full bg-primary/5 blur-3xl"
          style={{
            width: '300px',
            height: '300px',
            left: `${20 + i * 25}%`,
            top: `${20 + (i % 2) * 40}%`,
            animation: 'soft-pulse 10s ease-in-out infinite',
            animationDelay: `${i * 2.5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
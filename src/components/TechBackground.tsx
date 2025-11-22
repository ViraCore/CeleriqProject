import { useEffect, useRef } from 'react';

const TechBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Detect if mobile for performance
    const isMobile = window.innerWidth < 768;
    const isLowPower = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight * 2);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: (e.clientY / window.innerHeight) * 2 - 1
      };
    };
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // ===== LAYER 1: Matrix Rain Effect =====
    class MatrixRain {
      x: number;
      y: number;
      speed: number;
      length: number;
      chars: string[];
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.speed = Math.random() * 3 + 2;
        this.length = Math.floor(Math.random() * 15) + 10;
        this.chars = [];
        this.opacity = Math.random() * 0.5 + 0.3;
        const charset = '01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < this.length; i++) {
          this.chars.push(charset[Math.floor(Math.random() * charset.length)]);
        }
      }

      update(scrollY: number) {
        this.y += this.speed;
        if (this.y > canvas.height + scrollY) {
          this.y = -this.length * 20 + scrollY;
          this.x = Math.random() * canvas.width;
        }
      }

      draw(scrollY: number) {
        if (!ctx) return;
        ctx.font = '14px monospace';
        for (let i = 0; i < this.chars.length; i++) {
          const charY = this.y + i * 20;
          const opacity = this.opacity * (1 - i / this.length);
          const isHead = i === this.chars.length - 1;
          ctx.fillStyle = isHead 
            ? `rgba(0, 255, 170, ${opacity})` 
            : `rgba(0, 200, 150, ${opacity * 0.5})`;
          ctx.fillText(this.chars[i], this.x, charY);
        }
      }
    }

    const matrixRains: MatrixRain[] = [];
    const rainCount = isMobile ? 20 : 40;
    for (let i = 0; i < rainCount; i++) {
      matrixRains.push(new MatrixRain());
    }

    // ===== LAYER 2: Neural Network with Pulsing Connections =====
    class NeuralNode {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      pulsePhase: number;
      connections: number[];

      constructor(index: number) {
        this.baseX = Math.random() * canvas.width;
        this.baseY = Math.random() * canvas.height;
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * 3 + 2;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.connections = [];
      }

      update(scrollY: number, time: number, mouseX: number, mouseY: number) {
        const parallaxStrength = 0.3;
        this.y = this.baseY + scrollY * parallaxStrength;
        
        // Mouse follow effect
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300 && !isMobile) {
          this.x += dx * 0.01;
          this.y += dy * 0.01;
        } else {
          this.x += (this.baseX - this.x) * 0.05;
        }
        
        this.pulsePhase = time * 0.002;
      }

      draw(time: number) {
        if (!ctx) return;
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        const glowSize = this.size + pulse * 3;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize * 3);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${0.8 * pulse})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.3 * pulse})`);
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core node
        ctx.fillStyle = `rgba(167, 139, 250, ${0.8 + pulse * 0.2})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const neuralNodes: NeuralNode[] = [];
    const nodeCount = isMobile ? 30 : 80;
    for (let i = 0; i < nodeCount; i++) {
      neuralNodes.push(new NeuralNode(i));
    }

    // Create connections between nearby nodes
    neuralNodes.forEach((node, i) => {
      for (let j = i + 1; j < neuralNodes.length; j++) {
        const dx = node.baseX - neuralNodes[j].baseX;
        const dy = node.baseY - neuralNodes[j].baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          node.connections.push(j);
        }
      }
    });

    const drawNeuralConnections = (time: number) => {
      if (!ctx) return;
      neuralNodes.forEach((node, i) => {
        node.connections.forEach(targetIdx => {
          const target = neuralNodes[targetIdx];
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 250) {
            const pulse = Math.sin(time * 0.003 + i * 0.1) * 0.5 + 0.5;
            const opacity = (1 - dist / 250) * 0.3 * pulse;
            
            // Animated gradient along connection
            const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
            gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(236, 72, 153, ${opacity * 1.5})`);
            gradient.addColorStop(1, `rgba(6, 182, 212, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
            
            // Data pulse traveling along connection
            if (pulse > 0.7) {
              const pulsePos = (time * 0.01) % 1;
              const pulseX = node.x + dx * pulsePos;
              const pulseY = node.y + dy * pulsePos;
              ctx.fillStyle = `rgba(236, 72, 153, ${opacity * 2})`;
              ctx.beginPath();
              ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      });
    };

    // ===== LAYER 3: 3D Wireframe Shapes =====
    class WireframeShape {
      x: number;
      y: number;
      baseY: number;
      z: number;
      rotationX: number;
      rotationY: number;
      rotationZ: number;
      rotationSpeedX: number;
      rotationSpeedY: number;
      rotationSpeedZ: number;
      size: number;
      vertices: number[][];
      edges: number[][];
      type: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.baseY = Math.random() * canvas.height;
        this.y = this.baseY;
        this.z = Math.random() * 500 + 200;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.rotationSpeedX = (Math.random() - 0.5) * 0.02;
        this.rotationSpeedY = (Math.random() - 0.5) * 0.02;
        this.rotationSpeedZ = (Math.random() - 0.5) * 0.02;
        this.size = Math.random() * 40 + 30;
        
        // Choose random shape type
        const types = ['cube', 'pyramid', 'octahedron'];
        this.type = types[Math.floor(Math.random() * types.length)];
        
        // Define vertices and edges based on type
        if (this.type === 'cube') {
          this.vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
          ];
          this.edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
          ];
        } else if (this.type === 'pyramid') {
          this.vertices = [
            [-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1], [0, -1, 0]
          ];
          this.edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [0, 4], [1, 4], [2, 4], [3, 4]
          ];
        } else {
          this.vertices = [
            [1, 0, 0], [-1, 0, 0], [0, 1, 0],
            [0, -1, 0], [0, 0, 1], [0, 0, -1]
          ];
          this.edges = [
            [0, 2], [0, 3], [0, 4], [0, 5],
            [1, 2], [1, 3], [1, 4], [1, 5],
            [2, 4], [4, 3], [3, 5], [5, 2]
          ];
        }
      }

      rotatePoint(x: number, y: number, z: number) {
        // Rotate around X axis
        let y1 = y * Math.cos(this.rotationX) - z * Math.sin(this.rotationX);
        let z1 = y * Math.sin(this.rotationX) + z * Math.cos(this.rotationX);
        
        // Rotate around Y axis
        let x2 = x * Math.cos(this.rotationY) + z1 * Math.sin(this.rotationY);
        let z2 = -x * Math.sin(this.rotationY) + z1 * Math.cos(this.rotationY);
        
        // Rotate around Z axis
        let x3 = x2 * Math.cos(this.rotationZ) - y1 * Math.sin(this.rotationZ);
        let y3 = x2 * Math.sin(this.rotationZ) + y1 * Math.cos(this.rotationZ);
        
        return [x3, y3, z2];
      }

      project(x: number, y: number, z: number) {
        const perspective = 800;
        const scale = perspective / (perspective + z + this.z);
        return [
          this.x + x * this.size * scale,
          this.y + y * this.size * scale,
          scale
        ];
      }

      update(scrollY: number, mouseX: number, mouseY: number) {
        this.y = this.baseY + scrollY * 0.4;
        this.rotationX += this.rotationSpeedX;
        this.rotationY += this.rotationSpeedY;
        this.rotationZ += this.rotationSpeedZ;
        
        // Mouse influence
        if (!isMobile) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 400) {
            this.rotationY += dx * 0.00005;
            this.rotationX += dy * 0.00005;
          }
        }
      }

      draw() {
        if (!ctx) return;
        
        const projectedVertices = this.vertices.map(v => {
          const rotated = this.rotatePoint(v[0], v[1], v[2]);
          return this.project(rotated[0], rotated[1], rotated[2]);
        });
        
        ctx.strokeStyle = `rgba(6, 182, 212, 0.4)`;
        ctx.lineWidth = 1.5;
        
        this.edges.forEach(edge => {
          const v1 = projectedVertices[edge[0]];
          const v2 = projectedVertices[edge[1]];
          const avgScale = (v1[2] + v2[2]) / 2;
          
          ctx.globalAlpha = avgScale * 0.6;
          ctx.beginPath();
          ctx.moveTo(v1[0], v1[1]);
          ctx.lineTo(v2[0], v2[1]);
          ctx.stroke();
        });
        
        ctx.globalAlpha = 1;
      }
    }

    const wireframes: WireframeShape[] = [];
    const wireframeCount = isMobile ? 3 : 8;
    for (let i = 0; i < wireframeCount; i++) {
      wireframes.push(new WireframeShape());
    }

    // ===== LAYER 4: Circuit Board Patterns =====
    class CircuitPath {
      x: number;
      y: number;
      baseY: number;
      width: number;
      direction: 'horizontal' | 'vertical';
      pulseOffset: number;
      length: number;

      constructor() {
        this.direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        if (this.direction === 'horizontal') {
          this.x = 0;
          this.y = Math.random() * canvas.height;
          this.length = canvas.width;
        } else {
          this.x = Math.random() * canvas.width;
          this.y = 0;
          this.length = canvas.height;
        }
        this.baseY = this.y;
        this.width = Math.random() * 2 + 1;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(scrollY: number) {
        if (this.direction === 'vertical') {
          this.y = scrollY * 0.2;
        } else {
          this.y = this.baseY + scrollY * 0.15;
        }
      }

      draw(time: number) {
        if (!ctx) return;
        const pulse = Math.sin(time * 0.002 + this.pulseOffset) * 0.5 + 0.5;
        
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 + pulse * 0.15})`;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        
        if (this.direction === 'horizontal') {
          ctx.moveTo(0, this.y);
          ctx.lineTo(canvas.width, this.y);
          
          // Electric pulse traveling
          const pulseX = (time * 0.5) % canvas.width;
          const gradient = ctx.createRadialGradient(pulseX, this.y, 0, pulseX, this.y, 50);
          gradient.addColorStop(0, `rgba(236, 72, 153, ${0.8 * pulse})`);
          gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(pulseX - 50, this.y - 5, 100, 10);
        } else {
          ctx.moveTo(this.x, 0);
          ctx.lineTo(this.x, canvas.height);
          
          const pulseY = (time * 0.5) % canvas.height;
          const gradient = ctx.createRadialGradient(this.x, pulseY, 0, this.x, pulseY, 50);
          gradient.addColorStop(0, `rgba(6, 182, 212, ${0.8 * pulse})`);
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(this.x - 5, pulseY - 50, 10, 100);
        }
        ctx.stroke();
      }
    }

    const circuits: CircuitPath[] = [];
    const circuitCount = isMobile ? 10 : 25;
    for (let i = 0; i < circuitCount; i++) {
      circuits.push(new CircuitPath());
    }

    // ===== LAYER 5: Scanning Laser Beams =====
    class ScannerBeam {
      y: number;
      speed: number;
      height: number;
      color: string;
      opacity: number;

      constructor() {
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 2 + 1;
        this.height = Math.random() * 3 + 2;
        const colors = ['rgba(139, 92, 246,', 'rgba(236, 72, 153,', 'rgba(6, 182, 212,'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.3 + 0.2;
      }

      update(scrollY: number) {
        this.y += this.speed;
        if (this.y > canvas.height + scrollY) {
          this.y = -100 + scrollY;
        }
      }

      draw() {
        if (!ctx) return;
        const gradient = ctx.createLinearGradient(0, this.y - 50, 0, this.y + 50);
        gradient.addColorStop(0, `${this.color} 0)`);
        gradient.addColorStop(0.5, `${this.color} ${this.opacity})`);
        gradient.addColorStop(1, `${this.color} 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, this.y - 50, canvas.width, 100);
        
        // Bright center line
        ctx.fillStyle = `${this.color} ${this.opacity * 1.5})`;
        ctx.fillRect(0, this.y, canvas.width, this.height);
      }
    }

    const scanners: ScannerBeam[] = [];
    const scannerCount = isMobile ? 2 : 5;
    for (let i = 0; i < scannerCount; i++) {
      scanners.push(new ScannerBeam());
    }

    // ===== LAYER 6: Data Stream Particles =====
    class DataParticle {
      x: number;
      y: number;
      baseY: number;
      speedX: number;
      speedY: number;
      size: number;
      color: string;
      trail: Array<{x: number, y: number}>;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.baseY = Math.random() * canvas.height;
        this.y = this.baseY;
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
        this.size = Math.random() * 2 + 1;
        const colors = ['rgba(139, 92, 246', 'rgba(236, 72, 153', 'rgba(6, 182, 212'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.trail = [];
      }

      update(scrollY: number) {
        this.y = this.baseY + scrollY * 0.25;
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Keep trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) {
          this.trail.shift();
        }
        
        // Wrap around
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height + scrollY) this.y = scrollY;
        if (this.y < scrollY) this.y = canvas.height + scrollY;
      }

      draw() {
        if (!ctx) return;
        // Draw trail
        this.trail.forEach((point, index) => {
          const opacity = (index / this.trail.length) * 0.5;
          ctx.fillStyle = `${this.color}, ${opacity})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, this.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw particle
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, `${this.color}, 0.8)`);
        gradient.addColorStop(1, `${this.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const dataParticles: DataParticle[] = [];
    const dataParticleCount = isMobile ? 30 : 100;
    for (let i = 0; i < dataParticleCount; i++) {
      dataParticles.push(new DataParticle());
    }

    // ===== LAYER 7: Massive Glowing Orbs =====
    class MegaOrb {
      x: number;
      y: number;
      baseY: number;
      radius: number;
      hue: number;
      pulsePhase: number;
      speed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.baseY = Math.random() * canvas.height;
        this.y = this.baseY;
        this.radius = Math.random() * 150 + 100;
        this.hue = Math.random() * 60 + 260;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.1 + 0.05;
      }

      update(scrollY: number, time: number) {
        this.y = this.baseY + scrollY * 0.5;
        this.x += this.speed;
        this.pulsePhase = time * 0.001;
        
        if (this.x > canvas.width + this.radius) {
          this.x = -this.radius;
          this.baseY = Math.random() * canvas.height;
        }
      }

      draw(time: number) {
        if (!ctx) return;
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const currentRadius = this.radius * pulse;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentRadius);
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, 0.2)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 80%, 60%, 0.1)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 80%, 60%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const megaOrbs: MegaOrb[] = [];
    const megaOrbCount = isMobile ? 3 : 12;
    for (let i = 0; i < megaOrbCount; i++) {
      megaOrbs.push(new MegaOrb());
    }

    // ===== ANIMATION LOOP =====
    let startTime = Date.now();
    let animationFrameId: number;
    
    const animate = () => {
      if (!ctx) return;
      
      const time = Date.now() - startTime;
      const scrollY = window.scrollY;
      const mouseX = mousePos.current.x;
      const mouseY = mousePos.current.y + scrollY;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Layer rendering (back to front)
      
      // 1. Mega orbs (far background)
      if (!isLowPower) {
        megaOrbs.forEach(orb => {
          orb.update(scrollY, time);
          orb.draw(time);
        });
      }
      
      // 2. Circuit patterns
      circuits.forEach(circuit => {
        circuit.update(scrollY);
        circuit.draw(time);
      });
      
      // 3. Scanner beams
      scanners.forEach(scanner => {
        scanner.update(scrollY);
        scanner.draw();
      });
      
      // 4. Data particles with trails
      dataParticles.forEach(particle => {
        particle.update(scrollY);
        particle.draw();
      });
      
      // 5. 3D Wireframe shapes
      if (!isLowPower) {
        wireframes.forEach(shape => {
          shape.update(scrollY, mouseX, mouseY);
          shape.draw();
        });
      }
      
      // 6. Neural network
      neuralNodes.forEach(node => {
        node.update(scrollY, time, mouseX, mouseY);
      });
      drawNeuralConnections(time);
      neuralNodes.forEach(node => {
        node.draw(time);
      });
      
      // 7. Matrix rain (front layer)
      if (!isMobile) {
        matrixRains.forEach(rain => {
          rain.update(scrollY);
          rain.draw(scrollY);
        });
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default TechBackground;

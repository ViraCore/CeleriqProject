import { useState, useEffect } from 'react';

interface CyberpunkLoaderProps {
  onComplete: () => void;
}

const CyberpunkLoader = ({ onComplete }: CyberpunkLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const loadingMessages = [
    'INITIALIZING SYSTEM...',
    'LOADING NEURAL NETWORKS...',
    'CONNECTING TO CELERIQ MAINFRAME...',
    'SYNCING AI MODULES...',
    'OPTIMIZING PERFORMANCE...',
    'PREPARING DIGITAL ECOSYSTEM...',
    'ESTABLISHING SECURE CONNECTION...',
    'READY FOR EXPLORATION...'
  ];

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Progress bar animation
  useEffect(() => {
    const duration = 5000; // 5 seconds total
    const steps = 100;
    const stepDuration = duration / steps;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Update loading messages based on progress
  useEffect(() => {
    const messageIndex = Math.floor((progress / 100) * loadingMessages.length);
    if (messageIndex < loadingMessages.length) {
      setCurrentMessage(loadingMessages[messageIndex]);
    }
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-scroll"></div>
      </div>

      {/* Scanning Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-line-vertical"></div>
        <div className="scan-line-horizontal"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl w-full px-6 space-y-12">
        {/* CelerIQ Logo/Title */}
        <div className="text-center space-y-4">
          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 glitch-text-loader" data-text="CelerIQ">
            CelerIQ
          </h1>
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
        </div>

        {/* Terminal Box */}
        <div className="relative border-2 border-cyan-500/50 bg-black/60 backdrop-blur-lg p-8 rounded-lg shadow-2xl shadow-cyan-500/30">
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

          {/* Scanning Effect */}
          <div className="scanner-line-loader"></div>

          {/* System Messages */}
          <div className="space-y-4 font-mono">
            {/* System Header */}
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="animate-pulse">{'>'}</span>
              <span className="text-lg">SYSTEM STATUS</span>
            </div>

            {/* Current Message */}
            <div className="flex items-center gap-2 text-green-400 text-sm md:text-base">
              <span className="animate-pulse">▸</span>
              <span>{currentMessage}</span>
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>█</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between items-center text-xs text-cyan-300">
                <span>INITIALIZATION PROGRESS</span>
                <span className="text-2xl font-bold tabular-nums">{progress}%</span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="relative h-4 bg-gray-800/80 rounded-full overflow-hidden border border-cyan-500/30">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20 bg-progress-grid"></div>
                
                {/* Progress Fill */}
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-progress"></div>
                </div>

                {/* Progress Glow */}
                <div 
                  className="absolute inset-y-0 left-0 bg-cyan-400/30 blur-xl transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Loading Dots */}
              <div className="flex items-center gap-2 text-xs text-cyan-400/70">
                <span>LOADING</span>
                <span className="flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4 text-center font-mono text-xs">
          <div className="space-y-1">
            <div className={`w-3 h-3 mx-auto rounded-full ${progress > 30 ? 'bg-green-500' : 'bg-gray-600'} animate-pulse`}></div>
            <div className={progress > 30 ? 'text-green-400' : 'text-gray-500'}>NEURAL NET</div>
          </div>
          <div className="space-y-1">
            <div className={`w-3 h-3 mx-auto rounded-full ${progress > 60 ? 'bg-green-500' : 'bg-gray-600'} animate-pulse`}></div>
            <div className={progress > 60 ? 'text-green-400' : 'text-gray-500'}>AI MODULES</div>
          </div>
          <div className="space-y-1">
            <div className={`w-3 h-3 mx-auto rounded-full ${progress > 90 ? 'bg-green-500' : 'bg-gray-600'} animate-pulse`}></div>
            <div className={progress > 90 ? 'text-green-400' : 'text-gray-500'}>READY</div>
          </div>
        </div>
      </div>

      {/* Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle-float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CyberpunkLoader;

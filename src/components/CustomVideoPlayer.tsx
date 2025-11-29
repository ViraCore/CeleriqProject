import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, Settings, Loader2 } from "lucide-react";

interface CustomVideoPlayerProps {
  videoPath: string;
  className?: string;
}

const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2];

// Helper to detect connection speed
const getConnectionSpeed = (): string => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (connection) {
    const effectiveType = connection.effectiveType; // '4g', '3g', '2g', 'slow-2g'
    return effectiveType || 'unknown';
  }
  return 'unknown';
};

const CustomVideoPlayer = ({ videoPath, className = "" }: CustomVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('unknown');
  const [bufferHealth, setBufferHealth] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Format time helper
  const formatTime = (time: number): string => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Change playback speed
  const changePlaybackSpeed = useCallback((speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  }, []);

  // Seek to position
  const seekTo = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Handle progress bar click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * duration;
    seekTo(time);
  }, [duration, seekTo]);

  // Handle progress bar drag
  const handleProgressMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsSeeking(true);
    handleProgressClick(e);
  }, [handleProgressClick]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isSeeking || !progressRef.current || !videoRef.current) return;
      
      const rect = progressRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const time = pos * duration;
      seekTo(time);
    };

    const handleMouseUp = () => {
      setIsSeeking(false);
    };

    if (isSeeking) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSeeking, duration, seekTo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekTo(Math.max(0, currentTime - 5));
          break;
        case "ArrowRight":
          e.preventDefault();
          seekTo(Math.min(duration, currentTime + 5));
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.1));
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [currentTime, duration, togglePlay, toggleFullscreen, toggleMute, seekTo]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Detect connection speed on mount
    const speed = getConnectionSpeed();
    setConnectionSpeed(speed);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Calculate buffer health (how much is buffered ahead)
      if (video.buffered.length > 0) {
        for (let i = 0; i < video.buffered.length; i++) {
          if (video.buffered.start(i) <= video.currentTime && video.currentTime <= video.buffered.end(i)) {
            const bufferedAhead = video.buffered.end(i) - video.currentTime;
            setBufferHealth(bufferedAhead);
            break;
          }
        }
      }
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handleLoadedData = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleCanPlayThrough = () => setIsLoading(false);
    
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percentage = (bufferedEnd / video.duration) * 100;
        setBuffered(percentage);
      }
    };

    // Stalled event - video stopped due to buffering
    const handleStalled = () => {
      console.log("Video stalled - buffering...");
      setIsLoading(true);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("stalled", handleStalled);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("stalled", handleStalled);
    };
  }, []);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Volume change handler
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative group bg-black ${className}`}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element with optimizations for large files */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      >
        <source src={videoPath} type="video/mp4" />
        {/* Fallback message */}
        <p className="text-white text-center">Your browser doesn't support video playback.</p>
      </video>

      {/* Loading Spinner with buffer info */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
          <p className="text-white text-sm font-medium">Buffering video...</p>
          <p className="text-white/60 text-xs mt-1">
            {buffered > 0 ? `${Math.round(buffered)}% loaded` : 'Loading...'}
          </p>
        </div>
      )}

      {/* Custom Controls */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="relative h-2 cursor-pointer group/progress hover:h-3 transition-all"
          onClick={handleProgressClick}
          onMouseDown={handleProgressMouseDown}
        >
          {/* Buffered Progress */}
          <div className="absolute inset-0 bg-white/20">
            <div
              className="h-full bg-white/40 transition-all"
              style={{ width: `${buffered}%` }}
            />
          </div>

          {/* Current Progress */}
          <div
            className="absolute inset-0 bg-primary transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
          {/* Left Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary transition-colors p-1 sm:p-0"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 sm:h-6 sm:w-6" fill="white" />
              ) : (
                <Play className="h-5 w-5 sm:h-6 sm:w-6" fill="white" />
              )}
            </button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="text-white hover:text-primary transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (newVolume > 0) setIsMuted(false);
                }}
                className="w-0 group-hover/volume:w-20 transition-all opacity-0 group-hover/volume:opacity-100 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* Time */}
            <div className="text-white text-xs sm:text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Playback Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-white hover:text-primary transition-colors flex items-center gap-1 text-xs sm:text-sm font-medium"
                aria-label="Playback speed"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{playbackSpeed}x</span>
              </button>

              {/* Speed Menu */}
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-sm rounded-lg border border-white/10 py-1 min-w-[80px] shadow-xl">
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changePlaybackSpeed(speed)}
                      className={`w-full px-3 py-2 text-sm text-white hover:bg-primary/20 transition-colors text-left ${
                        speed === playbackSpeed ? "bg-primary/30 font-semibold" : ""
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-primary transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Center Play Button (when paused) */}
      {!isPlaying && !isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-6 hover:bg-black/70 transition-all hover:scale-110">
            <Play className="h-12 w-12 sm:h-16 sm:w-16 text-white" fill="white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;

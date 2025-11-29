import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Maximize, Minimize } from "lucide-react";

interface LazyCustomVideoPlayerProps {
  videoPath: string;
  className?: string;
  shouldLoad?: boolean; // Control when to actually load the video
}

const LazyCustomVideoPlayer = ({ videoPath, className = "", shouldLoad = false }: LazyCustomVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Load video source when shouldLoad becomes true
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || videoLoaded) return;

    // Add source element dynamically
    const source = document.createElement("source");
    source.src = videoPath;
    source.type = "video/mp4";
    video.appendChild(source);
    video.load();
    
    setVideoLoaded(true);
  }, [shouldLoad, videoPath, videoLoaded]);

  // Cleanup: Unload video when component unmounts or shouldLoad becomes false
  useEffect(() => {
    const video = videoRef.current;
    
    return () => {
      if (video) {
        // Pause and remove source to free up memory
        video.pause();
        video.removeAttribute('src');
        while (video.firstChild) {
          video.removeChild(video.firstChild);
        }
        video.load(); // Reset video element
      }
    };
  }, []);

  // Pause video when shouldLoad becomes false (modal closes)
  useEffect(() => {
    const video = videoRef.current;
    if (!shouldLoad && video && videoLoaded) {
      video.pause();
      setIsPlaying(false);
    }
  }, [shouldLoad, videoLoaded]);

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
      if (!videoRef.current || !videoLoaded) return;

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
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [currentTime, duration, togglePlay, toggleFullscreen, toggleMute, seekTo, videoLoaded]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    const handleDurationChange = () => setDuration(video.duration);
    
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percentage = (bufferedEnd / video.duration) * 100;
        setBuffered(percentage);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("progress", handleProgress);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("progress", handleProgress);
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

  // Auto-hide controls (YouTube-style behavior)
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Auto-hide controls after 3 seconds of inactivity (both regular and fullscreen)
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
      className={`relative group bg-black ${className} ${isFullscreen && !showControls ? 'cursor-none' : 'cursor-default'}`}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => {
        if (isPlaying && !isFullscreen) {
          setShowControls(false);
        }
      }}
    >
      {/* Video Element - source loaded dynamically */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        playsInline
        preload="none"
        crossOrigin="anonymous"
      >
        {/* Source will be added dynamically when shouldLoad is true */}
        <p className="text-white text-center">Your browser doesn't support video playback.</p>
      </video>

      {/* Custom Controls - Only show when video is loaded */}
      {videoLoaded && (
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 pb-2 ${
            showControls || !isPlaying ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="relative h-3 cursor-pointer group/progress hover:h-4 transition-all"
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
          >
            {/* Buffered Progress */}
            <div className="absolute inset-0 bg-white/30 rounded-full">
              <div
                className="h-full bg-white/50 transition-all rounded-full"
                style={{ width: `${buffered}%` }}
              />
            </div>

            {/* Current Progress */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-all rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            {/* Left Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:scale-110 transition-transform p-1"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 sm:h-7 sm:w-7" fill="white" />
                ) : (
                  <Play className="h-6 w-6 sm:h-7 sm:w-7" fill="white" />
                )}
              </button>

              {/* Time */}
              <div className="text-white text-sm sm:text-base font-semibold drop-shadow-lg">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:scale-110 transition-transform p-1"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="h-6 w-6 sm:h-7 sm:w-7" />
                ) : (
                  <Maximize className="h-6 w-6 sm:h-7 sm:w-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Center Play Button (when paused and video is loaded) */}
      {!isPlaying && videoLoaded && (
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

export default LazyCustomVideoPlayer;

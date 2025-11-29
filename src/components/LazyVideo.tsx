import { useRef, useEffect, useState } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
}

// Helper to detect connection speed
const getConnectionSpeed = (): string => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (connection) {
    const effectiveType = connection.effectiveType; // '4g', '3g', '2g', 'slow-2g'
    return effectiveType || 'unknown';
  }
  return 'unknown';
};

const LazyVideo = ({
  src,
  poster = "/placeholder.svg",
  className = "",
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
  onLoadStart,
  onLoadComplete,
}: LazyVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('unknown');

  // Detect connection speed
  useEffect(() => {
    const speed = getConnectionSpeed();
    setConnectionSpeed(speed);
    console.log(`Connection speed detected: ${speed}`);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            
            // Determine if we should load based on connection speed
            const speed = connectionSpeed;
            
            // For fast connections (4g), load immediately when in view
            // For slower connections, load only when very close to viewport
            if (speed === '4g' || speed === 'unknown') {
              setShouldLoad(true);
            } else if (speed === '3g' && entry.intersectionRatio > 0.3) {
              setShouldLoad(true);
            } else if ((speed === '2g' || speed === 'slow-2g') && entry.intersectionRatio > 0.5) {
              setShouldLoad(true);
            }
          } else {
            setIsInView(false);
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: [0, 0.3, 0.5, 1.0],
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [connectionSpeed]);

  // Load video source when shouldLoad is true
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    // Set the source
    if (!video.src && video.children.length === 0) {
      onLoadStart?.();
      
      const source = document.createElement("source");
      source.src = src;
      source.type = "video/mp4";
      video.appendChild(source);
      
      // Load the video
      video.load();
      
      // Handle load complete
      video.addEventListener("loadeddata", () => {
        onLoadComplete?.();
      });
    }
  }, [shouldLoad, src, onLoadStart, onLoadComplete]);

  // Auto play when in view (if enabled)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView || !autoPlay || !shouldLoad) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Auto-play prevented:", error);
      });
    }

    return () => {
      if (video && !video.paused) {
        video.pause();
      }
    };
  }, [isInView, autoPlay, shouldLoad]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload="metadata"
    >
      {/* Source will be added dynamically when video is in viewport */}
    </video>
  );
};

export default LazyVideo;

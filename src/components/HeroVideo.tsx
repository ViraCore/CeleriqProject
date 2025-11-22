import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroVideoProps {
  onVideoStart?: () => void;
}

const HeroVideo = ({ onVideoStart }: HeroVideoProps) => {
  const [showButton, setShowButton] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Disable/Enable scroll based on scrollEnabled state
  useEffect(() => {
    const preventScroll = (e: Event) => {
      if (!scrollEnabled) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    if (!scrollEnabled) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('scroll', preventScroll, { passive: false });
    } else {
      // Enable scroll
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'auto';
      document.body.style.height = 'auto';
    }

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('scroll', preventScroll);
      
      // Cleanup on unmount
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'auto';
      document.body.style.height = 'auto';
    };
  }, [scrollEnabled]);

  const handleExploreClick = () => {
    setShowButton(false);
    setVideoStarted(true);
    
    // Play the video from the beginning
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  // Handle video end event
  useEffect(() => {
    const video = videoRef.current;
    
    const handleVideoEnd = () => {
      // Enable scrolling
      setScrollEnabled(true);
      
      // Smooth scroll to content after video ends
      setTimeout(() => {
        if (contentRef.current) {
          const targetPosition = window.innerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
      
      onVideoStart?.();
    };

    if (video) {
      video.addEventListener('ended', handleVideoEnd);
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [onVideoStart]);

  // Apply parallax effect after video ends and scrolling is enabled
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollEnabled) return;
      
      const scrolled = window.scrollY;
      if (videoRef.current) {
        // Parallax effect - video moves slower than scroll
        videoRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
        videoRef.current.style.transition = 'transform 0.1s ease-out';
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollEnabled]);

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video Background with Parallax */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Overlay Gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"
          style={{ 
            background: !videoStarted 
              ? "linear-gradient(180deg, hsl(0 0% 0% / 0.3), hsl(0 0% 0% / 0.6))" 
              : "transparent",
            transition: "background 1s ease-out"
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
          {showButton && (
            <div className="animate-scale-in space-y-6 text-center">
              <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
                Discover
              </h1>
              <p className="text-lg text-white/90 md:text-xl">
                Your journey begins here
              </p>
              <Button
                onClick={handleExploreClick}
                size="lg"
                className="group relative overflow-hidden bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/50"
              >
                <span className="relative z-10">Explore</span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Button>
              <div className="mt-12 animate-float">
                <ChevronDown className="h-8 w-8 text-white/70" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scroll Target Reference */}
      <div ref={contentRef} />
    </>
  );
};

export default HeroVideo;

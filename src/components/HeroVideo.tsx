import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroVideoProps {
  onVideoStart?: () => void;
}

const HeroVideo = ({ onVideoStart }: HeroVideoProps) => {
  const [showButton, setShowButton] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      // Smooth scroll to content after video ends
      if (contentRef.current) {
        const targetPosition = window.innerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
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

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (videoRef.current && scrolled > 0) {
        // Parallax effect on video
        videoRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out"
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

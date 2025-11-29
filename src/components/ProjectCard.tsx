import { useState, useRef, useEffect, useCallback } from "react";
import { Project } from "@/data/projects";
import { ExternalLink, Play, Loader2 } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index: number;
}

const ProjectCard = ({ project, onClick, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      {
        rootMargin: "100px", // Start loading 100px before entering viewport
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Video playback management with debouncing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered && videoLoaded) {
      video.currentTime = 0;
      video.play().catch(() => {
        // Video play failed, ignore silently
      });
    } else {
      video.pause();
    }
  }, [isHovered, videoLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
    setVideoLoading(false);
  }, []);

  const handleVideoLoadStart = useCallback(() => {
    setVideoLoading(true);
  }, []);

  // Debounced hover handlers
  const handleMouseEnter = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 100); // Small delay to prevent accidental hovers
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Calculate parallax offset based on card position and index
  const parallaxOffset = Math.sin((scrollY + index * 200) * 0.002) * 10;

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-md transition-all duration-500 ease-out cursor-pointer animate-fade-in hover:shadow-xl hover:border-primary/50"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both',
        transform: `translateY(${parallaxOffset}px)`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Video Background */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/50">
        {isInView && (
          <video
            ref={videoRef}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              isHovered && videoLoaded ? "opacity-100" : "opacity-0"
            }`}
            muted
            loop
            playsInline
            preload="none"
            onLoadStart={handleVideoLoadStart}
            onLoadedData={handleVideoLoad}
          >
            <source src={project.videoPath} type="video/mp4" />
          </video>
        )}

        {/* Loading Indicator */}
        {videoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}

        {/* Fallback Thumbnail */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${project.accentColor} transition-opacity duration-300 ${
            isHovered && videoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-center text-white">
            <Play className="mx-auto mb-2 h-12 w-12 opacity-70" />
            <p className="text-sm font-medium opacity-90">{project.category}</p>
          </div>
        </div>
      </div>

      {/* Content - Responsive padding */}
      <div className="relative p-4 sm:p-5 md:p-6">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight transition-all duration-300">
            {project.title}
          </h3>
          {project.liveLink !== "#" && (
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          )}
        </div>

        <p className={`mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground transition-all duration-300 ${
          isHovered ? "line-clamp-none" : "line-clamp-2"
        }`}>
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.techStack.slice(0, isHovered ? undefined : 3).map((tech, idx) => (
            <span
              key={idx}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-medium text-primary"
            >
              {tech}
            </span>
          ))}
          {!isHovered && project.techStack.length > 3 && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-medium text-muted-foreground">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Hover Indicator */}
        <div
          className={`mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm font-medium text-primary transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>Click to view details</span>
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </div>

      {/* Animated Border Glow */}
      <div
        className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r ${project.accentColor} opacity-0 blur-xl transition-opacity duration-300 ${
          isHovered ? "opacity-30" : ""
        }`}
      />
    </div>
  );
};

export default ProjectCard;

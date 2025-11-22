import { useState, useRef, useEffect } from "react";
import { Project } from "@/data/projects";
import { ExternalLink, Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index: number;
  onHoverChange?: (isHovered: boolean) => void;
}

const ProjectCard = ({ project, onClick, index, onHoverChange }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleMouseEnter = () => {
    if (isMobile) return; // Disable hover on mobile
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Disable hover on mobile
    setIsHovered(false);
    onHoverChange?.(false);
  };

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm cursor-pointer animate-fade-in transition-all duration-700 ease-in-out ${
        isHovered 
          ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[600px] shadow-[0_0_80px_rgba(168,85,247,0.4)] border-primary/50 scale-100" 
          : "relative border-border/50 bg-card/30 hover:border-border hover:shadow-lg scale-100"
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Video Background */}
      <div className={`relative w-full overflow-hidden bg-black transition-all duration-700 ${
        isHovered ? "aspect-video" : "aspect-video"
      }`}>
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-all duration-700 ${
            isHovered && videoLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={handleVideoLoad}
        >
          <source src={project.videoPath} type="video/mp4" />
        </video>

        {/* Fallback Thumbnail */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${project.accentColor} transition-all duration-700 ${
            isHovered && videoLoaded ? "opacity-0 scale-110" : "opacity-100 scale-100"
          }`}
        >
          <div className={`text-center text-white transition-all duration-500 ${
            isHovered ? "scale-110 opacity-0" : "scale-100 opacity-100"
          }`}>
            <Play className={`mx-auto mb-2 opacity-70 transition-all duration-500 ${
              isHovered ? "h-16 w-16" : "h-12 w-12"
            }`} />
            <p className="text-sm font-medium opacity-90">{project.category}</p>
          </div>
        </div>

        {/* Subtle bottom gradient for text readability */}
        <div
          className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-700 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Content */}
      <div className={`relative transition-all duration-700 ${
        isHovered ? "p-8" : "p-6"
      }`}>
        <div className="mb-2 flex items-start justify-between">
          <h3 className={`font-bold tracking-tight transition-all duration-700 ${
            isHovered ? "text-3xl" : "text-xl"
          }`}>
            {project.title}
          </h3>
          {project.liveLink !== "#" && (
            <ExternalLink className={`text-muted-foreground transition-all duration-500 group-hover:text-primary ${
              isHovered ? "h-6 w-6" : "h-5 w-5"
            }`} />
          )}
        </div>

        <p className={`text-muted-foreground transition-all duration-700 ${
          isHovered ? "line-clamp-none text-base mb-6 mt-3" : "line-clamp-2 text-sm mb-4"
        }`}>
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, isHovered ? undefined : 3).map((tech, idx) => (
            <span
              key={idx}
              className={`rounded-full bg-primary/10 px-3 py-1 font-medium text-primary transition-all duration-500 ${
                isHovered ? "text-sm" : "text-xs"
              }`}
              style={{
                transitionDelay: isHovered ? `${idx * 50}ms` : '0ms'
              }}
            >
              {tech}
            </span>
          ))}
          {!isHovered && project.techStack.length > 3 && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Hover Indicator */}
        <div
          className={`mt-6 flex items-center gap-2 font-medium text-primary transition-all duration-700 ${
            isHovered ? "opacity-100 text-base translate-y-0" : "opacity-0 text-sm -translate-y-2"
          }`}
        >
          <span>Click to view full details</span>
          <ExternalLink className="h-5 w-5 animate-pulse" />
        </div>
      </div>

      {/* Animated Glow Border */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${project.accentColor} transition-all duration-700 pointer-events-none ${
          isHovered ? "opacity-30 blur-xl" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default ProjectCard;

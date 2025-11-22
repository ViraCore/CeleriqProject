import { useState, useRef, useEffect } from "react";
import { Project } from "@/data/projects";
import { X, ExternalLink, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setIsPlaying(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Video Section */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            loop
            playsInline
            onClick={handleVideoClick}
          >
            <source src={project.videoPath} type="video/mp4" />
          </video>

          {/* Play/Pause Overlay */}
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100"
            onClick={handleVideoClick}
          >
            {isPlaying ? (
              <div className="rounded-full bg-black/50 p-6 backdrop-blur-sm">
                <Pause className="h-12 w-12 text-white" fill="white" />
              </div>
            ) : (
              <div className="rounded-full bg-black/50 p-6 backdrop-blur-sm">
                <Play className="h-12 w-12 text-white" fill="white" />
              </div>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-3">
              <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${project.accentColor}`} />
              <span className="text-sm font-medium text-muted-foreground">{project.category}</span>
            </div>
            <h2 className="mb-3 text-4xl font-bold tracking-tight">{project.title}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{project.description}</p>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className={`rounded-lg bg-gradient-to-r ${project.accentColor} px-4 py-2 text-sm font-medium text-white shadow-md`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={togglePlay}
              size="lg"
              variant="outline"
              className="group flex-1 min-w-[200px]"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause Demo
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Play Demo
                </>
              )}
            </Button>

            {project.liveLink !== "#" && (
              <Button
                onClick={() => window.open(project.liveLink, "_blank")}
                size="lg"
                className={`group flex-1 min-w-[200px] bg-gradient-to-r ${project.accentColor} text-white shadow-lg transition-all hover:shadow-xl hover:scale-105`}
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                View Live Project
              </Button>
            )}

            {project.liveLink === "#" && (
              <Button
                size="lg"
                variant="outline"
                disabled
                className="flex-1 min-w-[200px] cursor-not-allowed opacity-50"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Coming Soon
              </Button>
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

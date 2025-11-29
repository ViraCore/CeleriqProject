import { useEffect } from "react";
import { Project } from "@/data/projects";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomVideoPlayer from "./CustomVideoPlayer";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

        {/* Video Section with Custom Player */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-black">
          <CustomVideoPlayer videoPath={project.videoPath} className="w-full h-full" />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>

        {/* Content Section - Responsive padding */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <div className="mb-2 flex items-center gap-2 sm:gap-3">
              <div className={`h-1 w-8 sm:w-12 rounded-full bg-gradient-to-r ${project.accentColor}`} />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">{project.category}</span>
            </div>
            <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{project.title}</h2>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">{project.description}</p>
          </div>

          {/* Tech Stack */}
          <div className="mb-4 sm:mb-6">
            <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className={`rounded-lg bg-gradient-to-r ${project.accentColor} px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white shadow-md`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            {project.liveLink !== "#" && (
              <Button
                onClick={() => window.open(project.liveLink, "_blank")}
                size="lg"
                className={`group flex-1 w-full sm:min-w-[180px] bg-gradient-to-r ${project.accentColor} text-white shadow-lg transition-all hover:shadow-xl hover:scale-105`}
              >
                <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                View Live Project
              </Button>
            )}

            {project.liveLink === "#" && (
              <Button
                size="lg"
                variant="outline"
                disabled
                className="flex-1 w-full sm:min-w-[180px] cursor-not-allowed opacity-50"
              >
                <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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

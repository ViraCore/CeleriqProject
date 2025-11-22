import { useState, useEffect, useRef } from "react";
import HeroVideo from "@/components/HeroVideo";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import CyberpunkLoader from "@/components/CyberpunkLoader";
import { projects, Project } from "@/data/projects";

const Index = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showThemeToggle, setShowThemeToggle] = useState(false);
  
  const sectionHeaderRef = useRef<HTMLDivElement>(null);
  const techSectionRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);

  // Extract unique technologies from all projects
  const uniqueTechnologies = Array.from(
    new Set(projects.flatMap(project => project.techStack))
  ).sort();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const handleVideoStart = () => {
    setVideoStarted(true);
    // Show theme toggle after a short delay
    setTimeout(() => {
      setShowThemeToggle(true);
    }, 500);
  };

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  // Show loader first
  if (!loadingComplete) {
    return <CyberpunkLoader onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* AI-themed Background Animation */}
      <BackgroundAnimation show={videoStarted} />
      
      {/* Theme Toggle Button */}
      <ThemeToggle show={showThemeToggle} />
      
      {/* Hero Video Section with Ben 10 Animation */}
      <HeroVideo onVideoStart={handleVideoStart} />
      
      {/* Main Content */}
      <main className="relative z-20 bg-transparent">
        {/* Project Showcase Section */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            {/* Section Header with Parallax */}
            <div 
              ref={sectionHeaderRef}
              className="mb-16 text-center animate-fade-in"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <h2 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                  Featured Projects
                </span>
              </h2>
              <p className="text-lg text-muted-foreground md:text-xl">
                Hover to preview • Click to explore
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Technologies & Skills Section */}
        <section className="px-4 py-20 bg-muted/30 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl">
            <h3 
              ref={techSectionRef}
              className="mb-16 text-center text-4xl font-bold text-foreground relative z-20"
            >
              Technologies & Skills
            </h3>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              {uniqueTechnologies.map((tech, idx) => (
                <div
                  key={idx}
                  className="animate-fade-in rounded-lg border border-border/50 bg-card/70 px-6 py-3 backdrop-blur-md transition-all hover:scale-105 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <span className="text-sm font-medium">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="px-4 py-20">
          <div 
            ref={ctaSectionRef}
            className="mx-auto max-w-4xl"
          >
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 p-12 md:p-16 text-center backdrop-blur-md shadow-xl">
              <h3 className="mb-4 text-4xl md:text-5xl font-bold text-foreground">
                Let's Create Something Extraordinary
              </h3>
              <p className="mb-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Open to new opportunities, collaborations, and innovative projects.
              </p>
              <p className="mb-8 text-base text-muted-foreground/80 max-w-xl mx-auto">
                Whether you have a project in mind or just want to connect, I'd love to hear from you.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button
                  onClick={() => window.open('https://celeriq.in', '_blank')}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
                >
                  Get In Touch
                </button>
                
              </div>
              
           
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Back to Top & Refresh Buttons */}
      <BackToTop />
    </div>
  );
};

export default Index;

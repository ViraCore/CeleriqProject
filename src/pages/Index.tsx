import { useState, useEffect, useRef } from "react";
import HeroVideo from "@/components/HeroVideo";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import BackToTop from "@/components/BackToTop";

import ThemeToggle from "@/components/ThemeToggle";
import { projects, Project } from "@/data/projects";

const Index = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      
      
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
                <button
                  onClick={() => window.open('/your-resume.pdf', '_blank')}
                  className="rounded-full border-2 border-primary bg-background/70 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                >
                  View Resume
                </button>
              </div>
              
              {/* Social Links */}
              <div className="flex justify-center gap-6 pt-6 border-t border-border/30">
                <a
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://github.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-muted/30 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* About Column */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground">About</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Passionate about building innovative solutions at the intersection of 
                  technology and design. Specialized in AI, web development, and creating 
                  impactful digital experiences.
                </p>
              </div>

              {/* Quick Links Column */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">
                      Projects
                    </a>
                  </li>
                  <li>
                    <a href="#skills" className="text-muted-foreground hover:text-primary transition-colors">
                      Skills
                    </a>
                  </li>
                  <li>
                    <a href="mailto:your@email.com" className="text-muted-foreground hover:text-primary transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="/your-resume.pdf" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                      Resume
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Column */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground">Get In Touch</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:your@email.com" className="hover:text-primary transition-colors">
                      your@email.com
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Your Location</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-border/30">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
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

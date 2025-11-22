import { Github, Instagram, Mail } from 'lucide-react';

const footerLinks = {
  company: [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" }
  ],
  services: [
    { name: "Web Development", href: "#services" },
    { name: "AI Solutions", href: "#services" },
    { name: "UI/UX Design", href: "#services" },
    { name: "Consulting", href: "#services" }
  ],
  resources: [
    { name: "Case Studies", href: "#projects" },
    { name: "Documentation", href: "#docs" },
    { name: "Support", href: "#support" },
    { name: "Privacy Policy", href: "#privacy" }
  ]
};

export default function Footer() {
  const handleSubscribe = () => {
    const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value;
    if (email && email.includes('@')) {
      alert("Thanks for subscribing! We'll send you updates on our latest projects and insights.");
      (document.querySelector('input[type="email"]') as HTMLInputElement).value = '';
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/20 border-t border-border overflow-hidden">
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/favicon.png" 
                  alt="CelerIQ Logo" 
                  className="w-10 h-10"
                />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  CelerIQ
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                We turn complex data into clear, intelligent applications. 
                From AI core to final click, we're your hands-on product development partners.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a 
                href="https://github.com/celeriq"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/celeriq.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="mailto:celeriq2808@gmail.com"
                className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          

          {/* Services Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        

        
         

        
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </footer>
  );
}

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
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(204, 96%, 75%) 100%)' }}
                >
                  <span className="text-2xl font-bold text-primary-foreground">C</span>
                </div>
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

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
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

        {/* Newsletter Signup */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-xl font-semibold text-foreground mb-4">
              Stay Updated
            </h4>
            <p className="text-muted-foreground mb-6">
              Get insights on AI, product development, and industry trends.
            </p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground"
              />
              <button 
                onClick={handleSubscribe}
                className="px-6 py-3 bg-gradient-to-r from-primary to-primary text-primary-foreground font-medium rounded-lg hover:shadow-glow transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(204, 96%, 75%) 100%)' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <h4 className="text-lg font-semibold text-foreground mb-4 text-center">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <a href="mailto:celeriq2808@gmail.com" className="text-foreground hover:text-primary transition-colors">
                  celeriq2808@gmail.com
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Instagram</p>
                <a href="https://instagram.com/celeriq.ai" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                  @celeriq.ai
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <a href="tel:+916206630109" className="text-foreground hover:text-primary transition-colors">
                  +91 6206630109
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CelerIQ. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-primary transition-colors">
              Cookie Policy
            </a>
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

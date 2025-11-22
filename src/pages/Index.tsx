import { useState } from "react";
import HeroVideo from "@/components/HeroVideo";
import ContentSection from "@/components/ContentSection";

const Index = () => {
  const [videoStarted, setVideoStarted] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <HeroVideo onVideoStart={() => setVideoStarted(true)} />
      
      <main className="relative z-20 bg-background px-4 py-20">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="animate-fade-in space-y-4 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Experience the Journey
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Scroll down to explore what awaits
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ContentSection
              title="Immersive Design"
              description="Experience a seamless blend of visual storytelling and interactive elements that captivate and engage."
              delay={0}
            />
            <ContentSection
              title="Smooth Interactions"
              description="Every scroll, every click, crafted with precision to deliver a fluid and enjoyable user experience."
              delay={100}
            />
            <ContentSection
              title="Dynamic Content"
              description="Parallax scrolling and smooth animations bring depth and dimension to your browsing experience."
              delay={200}
            />
            <ContentSection
              title="Visual Excellence"
              description="High-quality video integration paired with elegant design creates memorable moments."
              delay={300}
            />
            <ContentSection
              title="Responsive Flow"
              description="Optimized for all devices, ensuring a perfect experience whether on mobile or desktop."
              delay={400}
            />
            <ContentSection
              title="Elegant Motion"
              description="Thoughtfully designed animations guide your journey through the content naturally."
              delay={500}
            />
          </div>

          <div className="mt-20 space-y-8 rounded-lg border border-border/50 bg-card/30 p-12 backdrop-blur-sm">
            <h3 className="text-center text-3xl font-bold text-foreground">
              Ready to Start?
            </h3>
            <p className="text-center text-lg text-muted-foreground">
              This is just the beginning. Explore more as you continue scrolling.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

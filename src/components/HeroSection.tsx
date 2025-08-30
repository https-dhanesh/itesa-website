import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="ITESA Technology Innovation" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Innovate.
          </span>
          <br />
          <span className="text-foreground">
            Transform.
          </span>
          <br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Excel.
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Empowering the next generation of innovators through technology, 
          collaboration, and excellence at our college.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-gradient-button hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg px-8 py-3"
          >
            Explore Events
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 text-lg px-8 py-3"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>

        {/* Animated Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">100+</div>
            <div className="text-foreground/60 text-sm uppercase tracking-wider">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">50+</div>
            <div className="text-foreground/60 text-sm uppercase tracking-wider">Events Organized</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">25+</div>
            <div className="text-foreground/60 text-sm uppercase tracking-wider">Projects Completed</div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-glow rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary rounded-full animate-pulse animation-delay-150" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary-glow rounded-full animate-pulse animation-delay-300" />
      </div>
    </section>
  );
};

export default HeroSection;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const [animationClass, setAnimationClass] = useState('');
  const [typedSuffix, setTypedSuffix] = useState('');
  const [suffixIndex, setSuffixIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopStarted, setLoopStarted] = useState(false);

  const basePhrase = "10 Years of ";
  const suffixes = [
    "Innovations",
    "Growth",
    "Discoveries",
    "Impact"
  ];

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('animationHasPlayed');
    if (hasPlayed) {
      setAnimationClass('animate-immediately');
      setLoopStarted(true);
    } else {
      const timer = setTimeout(() => {
        setAnimationClass('animate');
        sessionStorage.setItem('animationHasPlayed', 'true');
        setTimeout(() => setLoopStarted(true), 2800);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // --- THIS IS THE CORRECTED LOGIC FOR THE LOOP ---
  useEffect(() => {
    if (!loopStarted) return;

    const currentSuffix = suffixes[suffixIndex];
    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      // Handle deleting
      if (typedSuffix.length > 0) {
        timeoutId = setTimeout(() => {
          setTypedSuffix(currentSuffix.substring(0, typedSuffix.length - 1));
        }, 80); // Deleting speed
      } else {
        setIsDeleting(false);
        setSuffixIndex((prevIndex) => (prevIndex + 1) % suffixes.length);
      }
    } else {
      // Handle typing
      if (typedSuffix.length < currentSuffix.length) {
        timeoutId = setTimeout(() => {
          setTypedSuffix(currentSuffix.substring(0, typedSuffix.length + 1));
        }, 120); // Typing speed
      } else {
        // Pause at the end of the word
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, 2000); // Pause duration
      }
    }

    return () => clearTimeout(timeoutId);
  }, [typedSuffix, isDeleting, suffixIndex, loopStarted, suffixes]);

  return (
    <>
      <style>{`
        /* Keyframes for the typing animation */
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }

        /* Keyframes for blinking cursor */
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: hsl(var(--primary)); }
        }

        /* Base class for a typewriter line */
        .typewriter {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          width: 0;
          padding-bottom: 0.2em;
          margin-bottom: -0.1em;
        }
        
        .animate .typewriter-1 {
          animation: typing 1.2s steps(22, end) forwards;
        }

        .animate .typewriter-2 {
          animation: typing 0.6s steps(11, end) forwards;
          animation-delay: 1.2s;
        }
        
        .animate .typewriter-3 {
          animation: typing 1.0s steps(19, end) forwards;
          animation-delay: 1.8s;
        }

        /* Fade-in for content below the title */
        .fade-in-content {
          opacity: 0;
          transition: opacity 1s ease-in;
        }
        
        .animate .fade-in-content {
          opacity: 1;
          transition-delay: 2.8s;
        }

        .animate-immediately .typewriter {
          width: 100%;
        }
        .animate-immediately .fade-in-content {
          opacity: 1;
        }
        
        .slogan-container {
            min-height: 2.5em;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Righteous', sans-serif; /* Use the new font */
            font-size: 1.8rem; /* Made it a bit larger for projectors */
            letter-spacing: 0.05em; /* Added letter spacing for style */
            color: hsl(var(--foreground, 0 0% 95%) / 0.9);
        }
        .typewriter-cursor {
            border-right: 3px solid hsl(var(--primary));
            animation: blink-caret 0.75s step-end infinite;
            padding-right: 2px;
        }

        .bg-gradient-primary {
            background: var(--gradient-primary, linear-gradient(135deg, #3a7bfd, #6b4aff));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        .bg-gradient-button {
           background: var(--gradient-button, linear-gradient(135deg, #4d8aff, #6b4aff));
        }
        .text-foreground {
           color: hsl(var(--foreground, 0 0% 95%));
        }
        .text-foreground\\/80 {
            color: hsl(var(--foreground, 0 0% 95%) / 0.8);
        }
        .text-foreground\\/60 {
            color: hsl(var(--muted-foreground, 240 5% 65%));
        }
        .bg-gradient-hero {
            background: var(--gradient-hero, linear-gradient(180deg, hsl(var(--background, 240 10% 3.9%) / 0.7) 0%, hsl(var(--background, 240 10% 3.9%)) 100%));
        }
        .border-primary\\/30 {
            border-color: hsl(var(--primary, 217 91% 60%) / 0.3);
        }
        .text-primary {
            color: hsl(var(--primary, 217 91% 60%));
        }
        .hover\\:bg-primary\\/10:hover {
            background-color: hsl(var(--primary, 217 91% 60%) / 0.1);
        }
        .hover\\:border-primary:hover {
            border-color: hsl(var(--primary, 217 91% 60%));
        }
        .hover\\:shadow-glow:hover {
            box-shadow: var(--shadow-glow, 0 0 40px hsl(217 91% 60% / 0.3));
        }
      `}</style>

      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
        
        <div className="absolute inset-0 z-0">
          <img 
            src="https://bhephgetoquqyffcbxgt.supabase.co/storage/v1/object/public/images/College-Photo.194c9769.jpg"
            alt="ITESA Technology Innovation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-85" />
        </div>
        
        <div className={`relative z-20 text-center max-w-4xl mt-24 px-4 sm:px-6 lg:px-8 pointer-events-none ${animationClass}`}>
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight flex flex-col items-center">
            <span className="typewriter typewriter-1 block bg-gradient-primary">Information Technology</span>
            <span className="typewriter typewriter-2 block text-foreground">Engineering</span>
            <span className="typewriter typewriter-3 block bg-gradient-primary">Student Association</span>
          </h1>
          
          <div className="fade-in-content">
            <div className="slogan-container text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
              <span className='mr-2'>{basePhrase}</span>
              <span className="typewriter-cursor text-primary">{typedSuffix}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
              <Link to="/events">
                <Button size="lg" className="bg-gradient-button hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg px-8 py-3 rounded-lg text-white font-semibold">
                  Explore Events
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </Button>
              </Link>
              <Link to="https://www.instagram.com/itesa.dyp/">
              <Button 
                variant="outline" 
                size="lg"
                className="border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 text-lg px-8 py-3 rounded-lg font-semibold"
              >
                Watch Demo
                <Play className="ml-2 h-5 w-5 inline" />
              </Button>
              </Link>
            </div>

            <div className="my-5 grid grid-cols-3 sm:grid-cols-3 sm:gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-primary">100+</div>
                <div className="text-xs sm:text-sm text-foreground/60 uppercase tracking-wider">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-primary">50+</div>
                <div className="text-xs sm:text-sm text-foreground/60 uppercase tracking-wider">Events Organized</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-primary">25+</div>
                <div className="text-xs sm:text-sm text-foreground/60 uppercase tracking-wider">Projects Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
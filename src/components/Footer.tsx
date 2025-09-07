import { useState } from 'react'; // --- CHANGE 1: Import useState
import { supabase } from '@/integrations/supabase/client'; // --- CHANGE 2: Import Supabase client
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MapPin, Phone, Github, Instagram, Linkedin, Loader2, CheckCircle } from 'lucide-react';

const Footer = () => {
  // --- CHANGE 3: Add state for email input, loading, and messages ---
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // --- CHANGE 4: Create the form submission handler ---
  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setMessage('Please enter your email address.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert({ email: email });

      if (error) {
        // Handle specific error for duplicate emails gracefully
        if (error.code === '23505') { 
          throw new Error('This email is already subscribed.');
        }
        throw error;
      }

      setMessage('Thank you for subscribing!');
      setEmail(''); // Clear input on success
    } catch (error: any) {
      setMessage(error.message || 'An error occurred. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-card border-t border-border/30 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Stay Updated</span>
          </h3>
          <p className="text-foreground/70 mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for the latest events and updates from ITESA
          </p>
          
          {/* --- CHANGE 5: Wrap form elements and add submission handler --- */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-background/50 border-border/50 focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Button 
              type="submit" 
              className="bg-gradient-button hover:shadow-glow transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          
          {/* --- CHANGE 6: Add a message area for user feedback --- */}
          {message && (
            <div className={`mt-4 text-sm flex items-center justify-center gap-2 ${isError ? 'text-destructive' : 'text-green-500'}`}>
              {!isError && <CheckCircle className="h-4 w-4" />}
              {message}
            </div>
          )}
        </div>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Club Info */}
          <div>
            <h4 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              ITESA
            </h4>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              Innovation, Technology, and Excellence Students Association. 
              Empowering students through technology and innovation.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="hover:text-primary-glow">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary-glow">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary-glow">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-foreground mb-4">Quick Links</h5>
            <ul className="space-y-3">
              {['About Us', 'Events', 'Our Team', 'Contact', 'Gallery', 'Resources'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-foreground/70 hover:text-primary-glow transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="font-semibold text-foreground mb-4">Contact Info</h5>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-foreground/70 text-sm leading-relaxed">
                  Engineering College Campus<br />
                  Tech Department, Block A<br />
                  City, State 12345
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-foreground/70 text-sm">+91 12345 67890</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-foreground/70 text-sm">contact@itesa.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/30 pt-8 text-center">
          <p className="text-foreground/60 text-sm">
            © 2024 ITESA - Innovation, Technology & Excellence Students Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
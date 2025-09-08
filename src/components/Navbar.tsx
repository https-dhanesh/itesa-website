import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Our Team', href: '/team' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md bg-slate-900`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex">
            <Link to="/">
              <img 
                src="https://bhephgetoquqyffcbxgt.supabase.co/storage/v1/object/public/images/white_ITESA__png-removebg-preview.png" 
                alt="ITESA Logo" 
                className="h-6 w-auto" 
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-16 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-foreground/80 hover:text-primary-glow transition-colors duration-200 text-base font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>


          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                    Admin Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md rounded-lg mt-2 border border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-foreground/80 hover:text-primary-glow block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                {user ? (
                  <>
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                        Admin Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-full" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                      Admin Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
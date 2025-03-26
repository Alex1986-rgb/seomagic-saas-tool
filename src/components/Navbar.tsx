
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2"
          >
            <span className="text-primary">Seo</span>Market
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border p-4 shadow-lg animate-slide-down">
            <nav className="flex flex-col space-y-4">
              <NavLinks mobile />
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Link
                  to="/login"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLinks: React.FC<{ mobile?: boolean }> = ({ mobile }) => {
  const baseClasses = "transition-colors hover:text-primary";
  const mobileClasses = mobile ? "block py-2" : "";
  
  return (
    <>
      <Link to="/features" className={`${baseClasses} ${mobileClasses}`}>
        Features
      </Link>
      <Link to="/pricing" className={`${baseClasses} ${mobileClasses}`}>
        Pricing
      </Link>
      <Link to="/about" className={`${baseClasses} ${mobileClasses}`}>
        About
      </Link>
    </>
  );
};

export default Navbar;

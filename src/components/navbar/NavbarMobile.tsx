
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { RESOURCE_ITEMS, COMPANY_ITEMS } from './navConstants';
import NavbarDesktopAuth from './NavbarDesktopAuth';
import { ThemeSwitcher } from '../ThemeSwitcher';

interface NavbarMobileProps {
  isOpen: boolean;
  navItems: { name: string; path: string }[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  toggleAuth: () => void;
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  isOpen,
  navItems,
  isLoggedIn,
  isAdmin,
  toggleAuth,
}) => {
  const location = useLocation();
  const [resourceOpen, setResourceOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  const variants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0 }
  };

  const handleResourceToggle = () => {
    setResourceOpen(!resourceOpen);
    setCompanyOpen(false);
  };

  const handleCompanyToggle = () => {
    setCompanyOpen(!companyOpen);
    setResourceOpen(false);
  };

  // Add a check to hide admin-specific links on homepage
  const isHomePage = location.pathname === '/';

  return (
    <motion.div
      initial="closed"
      animate="open"
      exit="closed"
      variants={{
        open: { opacity: 1, height: 'auto' },
        closed: { opacity: 0, height: 0 }
      }}
      transition={{ duration: 0.3 }}
      className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border"
    >
      <div className="flex flex-col p-6 space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`py-2 text-lg ${
              location.pathname === item.path
                ? 'text-primary font-medium'
                : 'text-foreground'
            }`}
          >
            {item.name}
          </Link>
        ))}
        
        {/* Resources dropdown section */}
        <div className="border-t border-border pt-4">
          <button 
            onClick={handleResourceToggle}
            className="flex justify-between items-center w-full py-2 text-lg"
          >
            <span>Ресурсы</span>
            {resourceOpen ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </button>
          
          <motion.div
            initial="closed"
            animate={resourceOpen ? "open" : "closed"}
            variants={variants}
            className="overflow-hidden"
          >
            <div className="pl-4 py-2 space-y-3">
              {RESOURCE_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-1 ${
                    location.pathname === item.path
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Company dropdown section */}
        <div className="border-t border-border pt-4">
          <button 
            onClick={handleCompanyToggle}
            className="flex justify-between items-center w-full py-2 text-lg"
          >
            <span>Компания</span>
            {companyOpen ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </button>
          
          <motion.div
            initial="closed"
            animate={companyOpen ? "open" : "closed"}
            variants={variants}
            className="overflow-hidden"
          >
            <div className="pl-4 py-2 space-y-3">
              {COMPANY_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-1 ${
                    location.pathname === item.path
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Auth and theme switcher */}
        <div className="border-t border-border pt-4 flex justify-between items-center">
          {isLoggedIn && !isHomePage ? (
            <Link to="/profile" className="text-primary hover:underline">Личный кабинет</Link>
          ) : (
            <div>
              {isLoggedIn ? (
                <button 
                  onClick={toggleAuth} 
                  className="text-red-500 hover:underline"
                >
                  Выйти
                </button>
              ) : (
                <button 
                  onClick={toggleAuth} 
                  className="text-primary hover:underline"
                >
                  Войти
                </button>
              )}
            </div>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </motion.div>
  );
};

export default NavbarMobile;


import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '../ThemeSwitcher';
import { ShieldCheck, ChevronDown, ChevronUp, LogIn } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { NAV_ITEMS } from './navConstants';

interface NavbarMobileProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  toggleAuth: () => void;
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  isOpen,
  isLoggedIn,
  isAdmin,
  toggleAuth
}) => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  if (!isOpen) return null;

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const menuAnimation = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3
      } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuAnimation}
      className="md:hidden border-t py-4 bg-background/95 backdrop-blur-md"
    >
      <div className="container space-y-4">
        <nav className="flex flex-col space-y-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.href} className="rounded-md overflow-hidden">
              {item.children ? (
                <div className="bg-accent/10 rounded-md">
                  <button 
                    className="flex justify-between items-center w-full px-4 py-3 hover:bg-accent/20 transition-colors"
                    onClick={() => toggleExpanded(item.href)}
                  >
                    <span className="font-medium">{item.label}</span>
                    {expandedItems.includes(item.href) ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  
                  {expandedItems.includes(item.href) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 py-1 space-y-1"
                    >
                      {item.children.map(subItem => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className="flex items-center justify-between px-4 py-2 hover:bg-accent/20 rounded-md transition-colors text-sm"
                        >
                          <span>{subItem.label}</span>
                          <div className="flex gap-1">
                            {subItem.isNew && (
                              <Badge variant="default" className="py-0 px-1.5 text-[0.6rem] h-4">
                                New
                              </Badge>
                            )}
                            {subItem.isDemo && (
                              <Badge variant="outline" className="py-0 px-1.5 text-[0.6rem] h-4 border-green-400 text-green-500">
                                Demo
                              </Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link 
                  to={item.href} 
                  className="block px-4 py-3 hover:bg-accent/20 rounded-md transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          
          {/* Админ-панель */}
          {isAdmin && (
            <Link 
              to="/admin"
              className="flex items-center justify-between px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-md transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Админ-панель</span>
              </div>
              <Badge variant="default" className="bg-purple-500">
                ADMIN
              </Badge>
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <ThemeSwitcher />
          
          {isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={toggleAuth} className="flex-1">
              Выйти
            </Button>
          ) : (
            <Button onClick={() => navigate('/auth')} variant="glassmorphic" className="flex-1 flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Войти
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NavbarMobile;

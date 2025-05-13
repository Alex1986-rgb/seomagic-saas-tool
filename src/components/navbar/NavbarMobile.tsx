
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '../ThemeSwitcher';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
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
      className="md:hidden border-t py-4 bg-background"
    >
      <div className="container space-y-4">
        <nav className="flex flex-col space-y-2">
          {NAV_ITEMS.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <div>
                  <button 
                    className="flex justify-between items-center w-full px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    onClick={() => toggleExpanded(item.href)}
                  >
                    <span>{item.label}</span>
                    {expandedItems.includes(item.href) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  
                  {expandedItems.includes(item.href) && (
                    <div className="pl-6 mt-1 space-y-1 border-l border-border ml-4">
                      {item.children.map(subItem => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className="block px-4 py-2 hover:bg-accent rounded-md transition-colors text-sm"
                        >
                          <div className="flex items-center gap-2">
                            {subItem.label}
                            {subItem.isDemo && (
                              <Badge variant="outline" className="py-0 px-1 text-[0.6rem] border-green-400 text-green-500">
                                DEMO
                              </Badge>
                            )}
                            {subItem.isNew && (
                              <Badge variant="default" className="py-0 px-1 text-[0.6rem]">
                                NEW
                              </Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to={item.href} 
                  className="px-4 py-2 hover:bg-accent rounded-md transition-colors block"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          
          {/* Admin panel - always visible */}
          <Link 
            to="/admin"
            className="px-4 py-2 hover:bg-accent rounded-md transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Админ-панель</span>
            <Badge variant="default" className="ml-1 py-0 px-1 text-[0.6rem] bg-purple-500">
              ADMIN
            </Badge>
          </Link>
        </nav>
        
        <div className="flex items-center gap-2 pt-4 border-t">
          <ThemeSwitcher />
          
          {isLoggedIn ? (
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={toggleAuth}>
                Выйти
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/auth')} variant="default" className="w-full">
              Войти
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NavbarMobile;

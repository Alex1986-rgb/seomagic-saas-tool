
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Home, Search, LineChart, Settings, Layers } from "lucide-react";

const Navigation: React.FC = () => {
  const navItems = [
    { label: 'Home', to: '/', icon: <Home className="w-5 h-5 mr-2" /> },
    { label: 'SEO Audit', to: '/audit', icon: <Search className="w-5 h-5 mr-2" /> },
    { label: 'Advanced Audit', to: '/seo-audit', icon: <Layers className="w-5 h-5 mr-2" /> },
    { label: 'Position Tracker', to: '/position-tracker', icon: <LineChart className="w-5 h-5 mr-2" /> },
    { label: 'Admin', to: '/admin', icon: <Settings className="w-5 h-5 mr-2" /> }
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => cn(
            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive 
              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" 
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          )}
          end={item.to === '/'}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;

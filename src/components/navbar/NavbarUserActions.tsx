import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  BarChart, 
  Settings, 
  User, 
  LogOut, 
  LayoutDashboard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface NavbarUserActionsProps {
  isLoggedIn: boolean;
}

const NavbarUserActions: React.FC<NavbarUserActionsProps> = ({ isLoggedIn }) => {
  const { logout } = useAuth();
  const { toast } = useToast();

  // ⚠️ TESTING MODE - Hide all auth-related UI
  return null;
};

export default NavbarUserActions;

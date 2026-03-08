import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, User, Settings, LogOut, Code, AlertCircle } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';

export function TopNav() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        
        {/* Brand & Main Navigation (Shadcn NavigationMenu) */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2 mr-4">
            <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/30">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold hidden sm:inline-block tracking-tight text-lg">
              AgriCore <Badge variant="secondary" className="ml-1 text-[10px] uppercase">v2.0</Badge>
            </span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <Link to="/diagnose">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Plant Doctor
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/recommend">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Agronomy Engine
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/query">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Neel Interface
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Actions (Shadcn Dropdown, Avatar, Button) */}
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="hidden lg:flex items-center gap-1.5 h-7 px-3 font-mono text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </Badge>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full px-0">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`} alt="Avatar" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.email ? user.email.substring(0, 2).toUpperCase() : 'AG'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Operator</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Preferences</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Code className="mr-2 h-4 w-4" />
                    <span>API Access</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            null // The App handles unauthenticated state at root usually, but kept for completeness
          )}
        </div>
      </div>
    </div>
  );
}

export default TopNav;

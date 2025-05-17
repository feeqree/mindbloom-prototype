
'use client';

import { Leaf, UserCircle, Settings, LogOut, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from '@/components/ui/button';

export function Header() {
  const handleLogout = () => {
    // Placeholder for logout functionality
    console.log("Logout clicked");
    // In a real app, you'd clear user session, redirect, etc.
    // For now, could also simulate points loss or streak reset if desired.
  };

  // Placeholder values for streaks and points
  const dayStreak = 0;
  const userPoints = 0;

  return (
    <header className="py-4 px-4 md:px-8 border-b border-border/50 shadow-sm bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">MindBloom</h1>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1" title="Your current daily streak">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Streak: {dayStreak} 🔥</span>
            </div>
            <div className="flex items-center gap-1" title="Your accumulated points">
              <Award className="h-5 w-5 text-primary" />
              <span>Points: {userPoints} ⭐</span>
            </div>
          </div>

          <Menubar className="bg-transparent border-none">
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open user menu">
                  <UserCircle className="h-7 w-7 text-foreground hover:text-primary transition-colors" />
                  <span className="sr-only">User Menu</span>
                </Button>
              </MenubarTrigger>
              <MenubarContent align="end" className="mt-2 shadow-lg rounded-md border bg-popover text-popover-foreground">
                <Link href="/profile" passHref>
                  <MenubarItem className="cursor-pointer py-2 px-3 hover:bg-accent focus:bg-accent">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </MenubarItem>
                </Link>
                <Link href="/settings" passHref>
                  <MenubarItem className="cursor-pointer py-2 px-3 hover:bg-accent focus:bg-accent">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </MenubarItem>
                </Link>
                <MenubarSeparator />
                <MenubarItem onClick={handleLogout} className="cursor-pointer py-2 px-3 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </header>
  );
}

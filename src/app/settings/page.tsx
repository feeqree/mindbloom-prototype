
"use client";

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ArrowLeft, Moon, Sun, Palette, Lock, Settings as SettingsIcon } from 'lucide-react'; // Added SettingsIcon

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const unlockableThemes = [
  { name: "Ocean Breeze", pointsRequired: 500, id: "ocean" },
  { name: "Forest Calm", pointsRequired: 750, id: "forest" },
  { name: "Sunset Glow", pointsRequired: 1000, id: "sunset" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = theme === 'dark';

  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handleThemeUnlockAttempt = (themeName: string) => {
    // Placeholder for actual theme unlocking logic
    console.log(`Attempted to unlock ${themeName}. In a real app, this would check points and apply the theme.`);
    alert(`Unlocking ${themeName} would require points. This feature is a visual placeholder.`);
  };

  const renderThemeToggle = () => {
    if (!mounted) {
      return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="dark-mode-skeleton" className="font-medium">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">Toggle dark theme for the application.</p>
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center">
          {isDarkMode ? <Moon className="mr-2 h-5 w-5 text-primary" /> : <Sun className="mr-2 h-5 w-5 text-primary" />}
          <div>
            <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">Toggle dark theme for the application.</p>
          </div>
        </div>
        <Switch 
          id="dark-mode" 
          checked={isDarkMode}
          onCheckedChange={toggleDarkMode} 
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl flex items-center">
              <SettingsIcon className="mr-3 h-7 w-7 text-primary" />
              Settings
            </CardTitle>
            <CardDescription>Manage your application preferences and appearance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center"><Palette className="mr-2 h-5 w-5 text-primary"/> Appearance</h3>
              {renderThemeToggle()}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center"><Lock className="mr-2 h-5 w-5 text-primary"/> Unlockable Themes</h3>
              <p className="text-sm text-muted-foreground">
                Earn points by using MindBloom features and unlock new themes to personalize your experience! (This is a visual placeholder for now).
              </p>
              <div className="space-y-3">
                {unlockableThemes.map((themeItem) => (
                  <div key={themeItem.id} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                    <div>
                      <p className="font-medium">{themeItem.name}</p>
                      <p className="text-xs text-muted-foreground">{themeItem.pointsRequired} points ⭐</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleThemeUnlockAttempt(themeItem.name)}
                      disabled // Disabled for now as it's a placeholder
                      aria-label={`Unlock ${themeItem.name} theme`}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Unlock
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />

            <div className="space-y-4">
               <h3 className="text-lg font-medium">Notifications</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <Label htmlFor="notifications" className="font-medium">Enable Reminder Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get gentle reminders to check in with MindBloom.</p>
                </div>
                <Switch 
                  id="notifications" 
                  defaultChecked={false} 
                  disabled 
                  aria-label="Enable reminder notifications"
                />
                {/* Notification switch is a placeholder, actual implementation requires backend/service worker */}
                </div>
            </div>


            <Button variant="outline" className="w-full mt-4" asChild>
               <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

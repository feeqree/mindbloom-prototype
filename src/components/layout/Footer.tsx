
"use client";

import { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";

const bloomMessages = [
  "Remember, small steps lead to big changes. You're doing great!",
  "Taking a moment for yourself is a sign of strength.",
  "Be kind to your mind today.",
  "Your feelings are valid, and exploring them is brave.",
  "Every day is a new opportunity to nurture your well-being."
];

export function Footer() {
  const [randomMessage, setRandomMessage] = useState<string | null>(null);

  useEffect(() => {
    // Select a random message only on the client side after hydration
    setRandomMessage(bloomMessages[Math.floor(Math.random() * bloomMessages.length)]);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <footer className="py-6 px-4 md:px-8 mt-auto">
      <Separator className="mb-6"/>
      <div className="container mx-auto text-center text-sm text-muted-foreground space-y-3">
        {randomMessage !== null && (
          <div className="flex items-center justify-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <p className="italic">Bloom says: "{randomMessage}"</p>
          </div>
        )}
        {/* Fallback or loading state if needed, or render nothing if randomMessage is null */}
        {randomMessage === null && (
            <div className="flex items-center justify-center gap-2 text-primary h-[20px]">
                 {/* Placeholder to maintain layout, or show a default message */}
            </div>
        )}
        <p>© {new Date().getFullYear()} MindBloom. Nurturing mental well-being, one bloom at a time.</p>
      </div>
    </footer>
  );
}

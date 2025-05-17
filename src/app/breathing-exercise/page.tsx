
"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, ArrowLeft, Volume2, Headphones } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const exerciseSteps = [
  { duration: 4000, instruction: "Get Ready: Find a comfortable position." },
  { duration: 4000, instruction: "Breathe In (1... 2... 3... 4...)" },
  { duration: 4000, instruction: "Hold (1... 2... 3... 4...)" },
  { duration: 6000, instruction: "Breathe Out (1... 2... 3... 4... 5... 6...)" },
  { duration: 2000, instruction: "Pause" },
];

export default function BreathingExercisePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const audioSrc = "/audio/breathing-exercise-guided.mp3"; // User needs to place this file

  useEffect(() => {
    if (audioRef.current) {
      const handleCanPlayThrough = () => setAudioLoaded(true);
      const handleError = (e: Event) => {
        console.error("Audio Error:", e);
        const audioElement = e.target as HTMLAudioElement;
        let message = "Could not load the audio file. Please ensure 'breathing-exercise-guided.mp3' exists in the 'public/audio' folder.";
        if (audioElement.error) {
            switch (audioElement.error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    message = 'Audio playback aborted.';
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    message = 'A network error caused the audio download to fail.';
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    message = 'The audio playback was aborted due to a corruption problem or because the audio used features your browser did not support.';
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    message = "The audio file format is not supported or the source is unavailable. Ensure 'breathing-exercise-guided.mp3' is in 'public/audio/'.";
                    break;
                default:
                    message = 'An unknown error occurred with the audio file.';
            }
        }
        setAudioError(message);
        setAudioLoaded(false);
      };

      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current.addEventListener('error', handleError);
      audioRef.current.load(); // Attempt to load

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
          audioRef.current.removeEventListener('error', handleError);
        }
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (isPlaying && audioLoaded) {
      setCurrentStepIndex(0); // Start from the beginning of text cues
      // If audio is expected to drive the timing, we start it.
      // Otherwise, text cues drive themselves if no audio or audio is supplemental.
      if (audioRef.current) {
        audioRef.current.play().catch(e => {
            console.error("Error playing audio:", e);
            setAudioError("Could not start audio playback. Please check browser permissions or console for errors.");
            setIsPlaying(false);
        });
      }
      // Start text cue cycling (independent if audio is only background)
      cycleInstructions();
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioLoaded]);

  const cycleInstructions = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setCurrentStepIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % exerciseSteps.length;
        if (nextIndex === 0 && isPlaying) { // Loop instructions if still playing
          cycleInstructions(); // Continue cycle
        } else if (!isPlaying && nextIndex === 0) { // Stopped and completed cycle
            return 0; // Reset to first instruction but don't auto-restart cycle
        }
        if (isPlaying) cycleInstructions(); // Continue if playing
        return nextIndex;
      });
    }, exerciseSteps[currentStepIndex]?.duration || 3000);
  };
  
  const handlePlayPause = () => {
    if (!audioLoaded && !audioError) {
        // If audio isn't loaded yet, and no definitive error, user might be trying to play.
        // We can attempt to load again or just let the initial load attempt complete.
        // For now, we'll just toggle isPlaying and let useEffect handle it.
         if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(e => {
              console.error("Error playing audio:", e);
              setAudioError("Could not start audio playback. Please check browser permissions.");
            });
        }
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentStepIndex(0);
    setIsPlaying(false); // Stop playing
    // Timeout to ensure it stops, then can be started again if user desires
    setTimeout(() => {
      if (audioLoaded) { // Only attempt to play if audio is usable
        setIsPlaying(true);
      }
    }, 100);
  };

  const currentInstruction = exerciseSteps[currentStepIndex]?.instruction || "Loading exercise...";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-xl shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Headphones className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl md:text-4xl">Audio-Guided Breathing</CardTitle>
            <CardDescription>
              Follow the audio and text cues to guide your breath. This exercise can be done offline once loaded.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 text-center">
            {audioError && (
              <Alert variant="destructive">
                <Volume2 className="h-4 w-4" />
                <AlertTitle>Audio Playback Error</AlertTitle>
                <AlertDescription>{audioError}</AlertDescription>
              </Alert>
            )}
            {!audioError && !audioLoaded && (
                <div className="flex items-center justify-center space-x-2 text-muted-foreground py-4">
                    <RotateCcw className="h-5 w-5 animate-spin" />
                    <span>Loading audio guide...</span>
                </div>
            )}

            <audio ref={audioRef} src={audioSrc} preload="auto" className="hidden" loop={false} />
            
            <div className="p-8 bg-primary/10 rounded-lg min-h-[100px] flex items-center justify-center">
              <p className="text-2xl font-medium text-primary">
                {currentInstruction}
              </p>
            </div>

            <div className="flex justify-center items-center gap-4">
              <Button 
                onClick={handlePlayPause} 
                size="lg" 
                disabled={!audioLoaded && !audioError}
                aria-label={isPlaying ? "Pause breathing exercise" : "Play breathing exercise"}
              >
                {isPlaying ? <Pause className="mr-2 h-6 w-6" /> : <Play className="mr-2 h-6 w-6" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button 
                onClick={handleRestart} 
                variant="outline" 
                size="lg" 
                disabled={!audioLoaded && !audioError}
                aria-label="Restart breathing exercise"
              >
                <RotateCcw className="mr-2 h-6 w-6" />
                Restart
              </Button>
            </div>
             <p className="text-xs text-muted-foreground pt-4">
                Ensure your device volume is on. For the best experience, use headphones.
                If audio doesn't play, please verify the audio file path and browser permissions.
             </p>
             <Alert variant="default" className="mt-4 text-left">
                <Headphones className="h-4 w-4" />
                <AlertTitle>Offline Usage</AlertTitle>
                <AlertDescription>
                  This page and its audio guide are designed to work offline after the first visit, provided your browser has cached them. For guaranteed offline access, consider adding this app to your home screen if PWA features are enabled.
                  The audio file `breathing-exercise-guided.mp3` must be present in the `public/audio/` folder of the project.
                </AlertDescription>
              </Alert>
          </CardContent>
        </Card>
        <Button variant="outline" className="w-full max-w-xl mt-8" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}

    

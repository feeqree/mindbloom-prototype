
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuestionnaireFlow } from '@/components/questionnaire/QuestionnaireFlow';
import { ScoreDisplay } from '@/components/results/ScoreDisplay';
import { SpeechAnalysis } from '@/components/speech/SpeechAnalysis';
import { Button } from '@/components/ui/button';
import { Brain, Mic, MessageSquareText, Users, Wind } from 'lucide-react'; // Added Wind icon
import Image from 'next/image';


type AppState = 'welcome' | 'questionnaire' | 'score' | 'speechAnalysis';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentScore, setCurrentScore] = useState(0);
  const [totalPossible, setTotalPossible] = useState(0);

  const handleStartAssessment = () => {
    setAppState('questionnaire');
  };

  const handleFinishAssessment = (score: number, totalPossibleScore: number) => {
    setCurrentScore(score);
    setTotalPossible(totalPossibleScore);
    setAppState('score');
  };

  const handleRetakeAssessment = () => {
    setAppState('questionnaire');
  };

  const handleGoToSpeechAnalysis = () => {
    setAppState('speechAnalysis');
  }

  const handleBackToWelcome = () => {
    setAppState('welcome');
  }

  const renderContent = () => {
    switch (appState) {
      case 'welcome':
        return (
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <Image
              src="https://picsum.photos/800/400"
              alt="Lush green forest scenery"
              width={800}
              height={400}
              className="rounded-xl shadow-2xl mx-auto"
              data-ai-hint="lush forest"
              priority
            />
            <h2 className="text-4xl font-semibold text-foreground">Welcome to MindBloom</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Take a few moments for yourself. This short assessment will help you understand your current mental well-being.
              Your responses are private and secure.
            </p>
            <p className="text-md text-muted-foreground">
              You can also use our speech analysis tool, AI companion, or guided breathing exercises to gain deeper insights and find calm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 flex-wrap">
              <Button
                onClick={handleStartAssessment}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse w-full sm:w-auto transform hover:scale-105 active:scale-95 transition-transform"
              >
                <Brain className="mr-2 h-5 w-5" />
                Start Mental Health Assessment
              </Button>
               <Link href="/breathing-exercise" passHref legacyBehavior>
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <a>
                    <Wind className="mr-2 h-5 w-5" />
                    Guided Breathing
                  </a>
                </Button>
              </Link>
              <Link href="/ai-chat" passHref legacyBehavior>
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <a>
                    <MessageSquareText className="mr-2 h-5 w-5" />
                    Chat with AI Companion
                  </a>
                </Button>
              </Link>
              <Button
                onClick={handleGoToSpeechAnalysis}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto transform hover:scale-105 active:scale-95 transition-transform"
              >
                <Mic className="mr-2 h-5 w-5" />
                Try Speech Analysis
              </Button>
              <Link href="/professional-help" passHref legacyBehavior>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto transform hover:scale-105 active:scale-95 transition-transform"
                >
                  <a>
                    <Users className="mr-2 h-5 w-5" />
                    Talk to a Professional
                  </a>
                </Button>
              </Link>
            </div>
          </div>
        );
      case 'questionnaire':
        return <QuestionnaireFlow onFinish={handleFinishAssessment} />;
      case 'score':
        return (
          <div className="w-full max-w-2xl space-y-6">
            <ScoreDisplay score={currentScore} totalPossibleScore={totalPossible} onRetake={handleRetakeAssessment} />
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/breathing-exercise" passHref legacyBehavior>
                <Button asChild variant="default" className="w-full sm:w-auto">
                  <a>
                    <Wind className="mr-2 h-5 w-5" />
                    Guided Breathing
                  </a>
                </Button>
              </Link>
              <Link href="/ai-chat" passHref legacyBehavior>
                 <Button asChild variant="default" className="w-full sm:w-auto">
                    <a>
                        <MessageSquareText className="mr-2 h-5 w-5" />
                        Chat with AI Companion
                    </a>
                </Button>
              </Link>
              <Button onClick={handleGoToSpeechAnalysis} variant="default" className="w-full sm:w-auto">
                <Mic className="mr-2 h-5 w-5" />
                Try Speech Analysis
              </Button>
              <Button onClick={handleBackToWelcome} className="w-full sm:w-auto">
                 Back to Home
              </Button>
            </div>
          </div>
        );
      case 'speechAnalysis':
        return (
            <div className="w-full max-w-2xl space-y-6">
                <SpeechAnalysis />
                <div className="text-center">
                    <Button onClick={handleBackToWelcome} variant="outline">
                        Back to Home
                    </Button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

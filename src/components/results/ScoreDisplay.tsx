
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getFeedbackMessage } from '@/lib/questions';
import { BarChart, Lightbulb, RotateCcw, Users, Sparkles, Loader2 } from 'lucide-react'; // Added Sparkles, Loader2
import { handleScoreInsight } from '@/app/actions/getScoreInsightAction'; // Import the new action
import { Alert, AlertDescription } from '@/components/ui/alert';

type ScoreDisplayProps = {
  score: number;
  totalPossibleScore: number;
  onRetake: () => void;
};

export function ScoreDisplay({ score, totalPossibleScore, onRetake }: ScoreDisplayProps) {
  const feedback = getFeedbackMessage(score, totalPossibleScore);
  const scorePercentage = totalPossibleScore > 0 ? Math.round((score / totalPossibleScore) * 100) : 0;
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  useEffect(() => {
    if (score !== undefined && totalPossibleScore !== undefined && totalPossibleScore > 0) {
      setIsLoadingInsight(true);
      setInsightError(null);
      handleScoreInsight({ score, totalPossibleScore })
        .then(result => {
          setAiInsight(result.insightMessage);
        })
        .catch(err => {
          console.error("Failed to fetch AI insight:", err);
          setInsightError("Bloom had a thought to share, but is quiet for now. Your self-reflection is what matters most!");
          setAiInsight(null); // Clear any previous insight
        })
        .finally(() => {
          setIsLoadingInsight(false);
        });
    }
  }, [score, totalPossibleScore]);

  return (
    <Card className="w-full max-w-2xl text-center shadow-xl animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Your Results</CardTitle>
        <CardDescription className="text-lg">
          Here's a summary of your mental well-being assessment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-secondary/30 rounded-lg">
          <BarChart className="h-16 w-16 text-primary mx-auto mb-4" />
          <p className="text-5xl font-bold text-foreground">{score}</p>
          <p className="text-muted-foreground">out of {totalPossibleScore} possible points</p>
          <div className="w-full bg-muted rounded-full h-2.5 my-4">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border/50 rounded-lg text-left">
          <div className="flex items-center mb-3">
             <Lightbulb className="h-6 w-6 text-accent mr-3 shrink-0" />
             <h3 className="text-xl font-semibold text-accent-foreground">Personalized Feedback</h3>
          </div>
          <p className="text-black dark:text-white">
            {feedback}
          </p>
        </div>

        {/* AI Insight Section */}
        {(isLoadingInsight || aiInsight || insightError) && (
          <div className="p-6 bg-card border border-border/50 rounded-lg text-left">
            <div className="flex items-center mb-3">
               <Sparkles className="h-6 w-6 text-primary mr-3 shrink-0" />
               <h3 className="text-xl font-semibold text-primary">A Quick Thought from Bloom</h3>
            </div>
            {isLoadingInsight && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Bloom is reflecting...</span>
              </div>
            )}
            {aiInsight && !isLoadingInsight && (
              <p className="text-black dark:text-white italic">"{aiInsight}"</p>
            )}
            {insightError && !isLoadingInsight && (
               <Alert variant="default" className="bg-muted/50">
                <AlertDescription>{insightError}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground px-4">
          Remember, this score is a snapshot and not a diagnosis. If you have concerns about your mental health, please consult with a healthcare professional.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
        <Button onClick={onRetake} variant="outline" size="lg">
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Assessment
        </Button>
        <Link href="/professional-help" passHref legacyBehavior>
          <Button asChild variant="default" size="lg">
            <a>
              <Users className="mr-2 h-4 w-4" />
              Find Professional Help
            </a>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

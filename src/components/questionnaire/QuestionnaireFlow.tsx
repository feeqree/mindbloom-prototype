
"use client";

import { useState } from 'react';
import type { Question } from '@/lib/questions';
import { mentalHealthQuestions, getTotalPossibleScore } from '@/lib/questions';
import { QuestionDisplay } from './QuestionDisplay';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'; // Added Sparkles

type QuestionnaireFlowProps = {
  onFinish: (score: number, totalPossibleScore: number) => void;
};

const bloomMotivationalMessages = [
  "You're doing great taking this time for yourself!",
  "Keep focusing, each answer helps you understand better.",
  "It's brave to explore your feelings. Keep going!",
  "Just a few more questions to go. You've got this!",
  "Wonderful, you're almost there. Well done!",
  "Reflecting like this is a positive step.",
  "Taking stock of your feelings is important work."
];

export function QuestionnaireFlow({ onFinish }: QuestionnaireFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const totalQuestions = mentalHealthQuestions.length;
  const currentQuestion = mentalHealthQuestions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: string, score: number) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: score,
    }));
  };

  const handleNext = () => {
    if (answers[currentQuestion.id] === undefined) {
      alert("Please select an answer before proceeding.");
      return;
    }
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
     if (answers[currentQuestion.id] === undefined && totalQuestions > 0) {
      alert("Please select an answer for the current question.");
      return;
    }
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const totalPossible = getTotalPossibleScore();
    onFinish(totalScore, totalPossible);
    console.log("Points awarded for completing the questionnaire! (e.g., +50 points). In a real app, this would update user's points in a database.");
  };

  const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const currentMotivationalMessage = bloomMotivationalMessages[currentQuestionIndex % bloomMotivationalMessages.length];

  if(totalQuestions === 0) {
    return <p className="text-muted-foreground">No questions available at the moment.</p>
  }

  return (
    <div className="w-full max-w-2xl space-y-6 p-4 md:p-0">
      <Progress value={progressValue} className="w-full h-2" />
      
      <div className="flex items-center justify-center text-center p-3 my-4 bg-primary/10 rounded-lg text-primary">
        <Sparkles className="h-6 w-6 mr-3 shrink-0 animate-pulse" />
        <p className="text-sm font-medium">{currentMotivationalMessage}</p>
      </div>

      <QuestionDisplay
        key={currentQuestion.id} 
        question={currentQuestion}
        onAnswerSelect={handleAnswerSelect}
        selectedValue={answers[currentQuestion.id]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
      />
      <div className="flex justify-between items-center pt-4">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button onClick={handleNext} disabled={answers[currentQuestion.id] === undefined}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="default" disabled={answers[currentQuestion.id] === undefined}>
            Submit
            <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

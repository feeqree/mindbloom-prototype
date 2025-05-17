
"use client";

import type { Question, QuestionOption } from '@/lib/questions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react'; // Added HelpCircle

type QuestionDisplayProps = {
  question: Question;
  onAnswerSelect: (questionId: string, score: number) => void;
  selectedValue?: number;
  questionNumber: number;
  totalQuestions: number;
};

export function QuestionDisplay({ question, onAnswerSelect, selectedValue, questionNumber, totalQuestions }: QuestionDisplayProps) {
  return (
    <Card className="w-full max-w-2xl shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardDescription className="text-sm flex items-center">
          <HelpCircle className="h-4 w-4 mr-2 text-primary/70" />
          Question {questionNumber} of {totalQuestions}
        </CardDescription>
        <CardTitle className="text-xl md:text-2xl">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedValue !== undefined ? selectedValue.toString() : undefined}
          onValueChange={(value) => onAnswerSelect(question.id, parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`${question.id}-option-${index}`}
              className="flex items-center space-x-3 p-4 rounded-md border border-input hover:bg-secondary/50 transition-all duration-150 ease-in-out cursor-pointer has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary/70 has-[input:checked]:shadow-md"
            >
              <RadioGroupItem value={option.score.toString()} id={`${question.id}-option-${index}`} />
              <span>{option.text}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

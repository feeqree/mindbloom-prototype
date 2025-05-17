
export type QuestionOption = {
  text: string;
  score: number;
};

export type Question = {
  id: string;
  text: string;
  options: QuestionOption[];
};

export const mentalHealthQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Over the last 2 weeks, how often have you been bothered by feeling little interest or pleasure in doing things?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'Several days', score: 1 },
      { text: 'More than half the days', score: 2 },
      { text: 'Nearly every day', score: 3 },
    ],
  },
  {
    id: 'q2',
    text: 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'Several days', score: 1 },
      { text: 'More than half the days', score: 2 },
      { text: 'Nearly every day', score: 3 },
    ],
  },
  {
    id: 'q3',
    text: 'Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'Several days', score: 1 },
      { text: 'More than half the days', score: 2 },
      { text: 'Nearly every day', score: 3 },
    ],
  },
  {
    id: 'q4',
    text: 'Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'Several days', score: 1 },
      { text: 'More than half the days', score: 2 },
      { text: 'Nearly every day', score: 3 },
    ],
  },
  {
    id: 'q5',
    text: 'Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'Several days', score: 1 },
      { text: 'More than half the days', score: 2 },
      { text: 'Nearly every day', score: 3 },
    ],
  },
  {
    id: 'q6',
    text: 'Over the last 2 weeks, how often have you been bothered by feeling bad about yourself - or that you are a failure or have let yourself or your family down?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'Several days', score: 1 },
      { text: 'More than half the days', score: 2 },
      { text: 'Nearly every day', score: 3 },
    ],
  },
  {
    id: 'q7',
    text: 'Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'Several days', score: 1 },
      { text: 'More than half the days', score: 2 },
      { text: 'Nearly every day', score: 3 },
    ],
  },
  {
    id: 'q8',
    text: 'Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'Several days', score: 1 },
      { text: 'More than half the days', score: 2 },
      { text: 'Nearly every day', score: 3 },
    ],
  },
  {
    id: 'q9',
    text: 'Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself in some way?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'Several days', score: 1 },
      { text: 'More than half the days', score: 2 },
      { text: 'Nearly every day', score: 3 },
    ],
  },
  {
    id: 'q10',
    text: 'Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'Several days', score: 1 },
      { text: 'More than half the days', score: 2 },
      { text: 'Nearly every day', score: 3 },
    ],
  },
];

export const getTotalPossibleScore = (): number => {
  return mentalHealthQuestions.reduce((total, question) => {
    const maxOptionScore = Math.max(...question.options.map(opt => opt.score));
    return total + maxOptionScore;
  }, 0);
};

export const getFeedbackMessage = (score: number, totalPossibleScore: number): string => {
  const percentage = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;

  if (percentage <= 20) { // Adjusted threshold for more questions
    return "Your responses suggest you are experiencing a very low level of distress. This is excellent! Continue to practice self-care and maintain your healthy habits.";
  } else if (percentage <= 40) { // Adjusted threshold
    return "Your responses suggest a low level of distress. Keep up the great work in maintaining your mental well-being and being mindful of your feelings!";
  } else if (percentage <= 60) { // Adjusted threshold
    return "Your responses indicate some mild concerns. It's good to be aware of these feelings. Consider exploring healthy coping strategies or talking to someone you trust.";
  } else if (percentage <= 80) { // Adjusted threshold
    return "Your responses suggest a moderate level of distress. It might be beneficial to reach out for support. Speaking with a friend, family member, or mental health professional could be helpful.";
  } else {
    return "Your responses indicate a significant level of distress. It's important to prioritize your mental health and seek professional support. Please consider talking to a mental health professional soon.";
  }
};

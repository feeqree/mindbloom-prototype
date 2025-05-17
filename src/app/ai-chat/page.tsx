
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Send, User, MessageSquareText, Loader2 } from 'lucide-react'; // Changed Bot to Sparkles
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { handleAIChat } from '@/app/actions/mentalHealthChatAction';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial greeting from AI
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: "Hello! I'm Bloom, your AI companion. I'm here to listen and support you. Feel free to share what's on your mind. The more you share about how you're feeling, the better I can understand and offer a thoughtful response. Remember, I'm an AI and cannot provide medical advice.",
        timestamp: new Date(),
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: userMessageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResult = await handleAIChat({ userMessage: userMessageText });
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: aiResult.aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      if (aiResult.aiResponse && !aiResult.aiResponse.toLowerCase().includes("error") && !aiResult.aiResponse.toLowerCase().includes("issue")) {
        console.log("Points awarded for engaging with Bloom! (e.g., +10 points per interaction). In a real app, this would update user's points in a database.");
      }
    } catch (error) { 
      console.error("Failed to get AI response on client:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: "I'm sorry, something went wrong while trying to reach my services. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <Card className="w-full max-w-2xl shadow-xl flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] md:h-[calc(100vh-16rem)] max-h-[700px]">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl md:text-3xl flex items-center justify-center">
              <MessageSquareText className="mr-3 h-7 w-7 text-primary" />
              Chat with Bloom
            </CardTitle>
            <CardDescription>
              Your AI companion for exploring your feelings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-grow p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2",
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.sender === 'ai' && (
                      <Avatar className="h-8 w-8 self-start">
                        <AvatarFallback><Sparkles size={20} className="text-primary"/></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-xl px-3 py-2 shadow-sm text-sm sm:text-base",
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-card border border-border text-card-foreground rounded-bl-none'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                       <p className={cn(
                        "text-xs mt-1.5 opacity-70",
                        msg.sender === 'user' ? 'text-right' : 'text-left'
                       )}>
                        {msg.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                       </p>
                    </div>
                     {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8 self-start">
                        <AvatarFallback><User size={20} /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center justify-start gap-2">
                     <Avatar className="h-8 w-8 self-start">
                        <AvatarFallback><Sparkles size={20} className="text-primary"/></AvatarFallback>
                      </Avatar>
                    <div className="bg-card border border-border text-card-foreground rounded-xl px-4 py-3 shadow-sm rounded-bl-none">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  className="flex-grow"
                  aria-label="Chat message input"
                />
                <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon" aria-label="Send message">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
         <Button variant="outline" className="w-full max-w-2xl mt-6" asChild>
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


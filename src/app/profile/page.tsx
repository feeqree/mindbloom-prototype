
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, Info, UserCircle } from 'lucide-react'; // Added UserCircle

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert'; 

export default function ProfilePage() {
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  // Placeholder for form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Collect form data here
    const formData = {
      name: (event.currentTarget.elements.namedItem('name') as HTMLInputElement)?.value,
      email: (event.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value,
      dob: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : '',
      gender: (event.currentTarget.elements.namedItem('gender') as HTMLSelectElement)?.value,
      occupation: (event.currentTarget.elements.namedItem('occupation') as HTMLInputElement)?.value,
      primaryGoal: (event.currentTarget.elements.namedItem('primaryGoal') as HTMLTextAreaElement)?.value,
      stressLevel: (event.currentTarget.elements.namedItem('stressLevel') as HTMLSelectElement)?.value,
    };
    console.log('Profile data submitted (UI placeholder):', formData);
    alert('Profile data saved (simulated)! In a real app, this would be stored on a server.');
    // Here you would typically send the data to your backend
  };
  
  if (!mounted) {
    // Prevents hydration mismatch for date picker by not rendering it on the server.
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center">
                <Card className="w-full max-w-lg shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl flex items-center">
                          <UserCircle className="mr-3 h-7 w-7 text-primary" />
                          Edit Profile
                        </CardTitle>
                        <CardDescription>Loading profile editor...</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="name-loading">Name</Label>
                            <Input id="name-loading" type="text" disabled placeholder="Loading..." />
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
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
              <UserCircle className="mr-3 h-7 w-7 text-primary" />
              Edit Profile
            </CardTitle>
            <CardDescription>Update your personal and well-being information here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-primary/10 border-primary/30">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary/90 text-sm">
                This information helps MindBloom understand you better. In the future, it could be used (with your explicit consent) to personalize your experience and provide more tailored insights. All data is currently for demonstration purposes.
              </AlertDescription>
            </Alert>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Enter your name" defaultValue="Bloom User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter your email" defaultValue="user@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={setDateOfBirth}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue="prefer_not_to_say">
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" name="occupation" placeholder="e.g., Student, Engineer, Artist" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryGoal">Primary Goal for using MindBloom</Label>
                <Textarea
                  id="primaryGoal"
                  name="primaryGoal"
                  placeholder="e.g., Reduce stress, understand my emotions better, improve focus"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stressLevel">Self-Reported Stress Level (last month)</Label>
                <Select name="stressLevel" defaultValue="moderate">
                  <SelectTrigger id="stressLevel">
                    <SelectValue placeholder="Select your stress level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="very_high">Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Save Changes</Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

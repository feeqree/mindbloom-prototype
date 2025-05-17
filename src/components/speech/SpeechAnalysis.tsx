
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Mic, MicOff, FileText, Smile, MessageCircle, Sparkles, StopCircle, Tags, RotateCcw } from 'lucide-react'; // Added RotateCcw
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { handleSpeechAnalysis } from '@/app/actions/analyzeSpeechAction';
import type { AnalyzeSpeechOutput } from '@/ai/flows/speech-to-text-analysis';
import { Badge } from '@/components/ui/badge'; 

export function SpeechAnalysis() {
  const { toast } = useToast();
  const { 
    startRecording, 
    stopRecording, 
    audioDataUri, 
    isRecording, 
    error: recorderError,
    resetRecording: hookResetRecording
  } = useAudioRecorder();
  
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSpeechOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false); // For AI analysis loading
  const [isWaitingForAudio, setIsWaitingForAudio] = useState(false); // For period after stopping record, before data URI is ready
  const [clientRecorderError, setClientRecorderError] = useState<string | null>(null);

  useEffect(() => {
    if (recorderError) {
        setClientRecorderError(recorderError);
        toast({ title: "Recording Error", description: recorderError, variant: "destructive" });
        setIsLoadingAnalysis(false);
        setIsWaitingForAudio(false);
    }
  }, [recorderError, toast]);


  useEffect(() => {
    // This effect handles the transition from recording to analysis
    if (isWaitingForAudio && !isRecording) { // Ensure recording has actually stopped
      if (audioDataUri && !clientRecorderError) {
        // Audio data is ready, proceed to analysis
        const performAiAnalysis = async () => {
          setIsLoadingAnalysis(true); 
          try {
            const result = await handleSpeechAnalysis({ audioDataUri });
            setAnalysisResult(result);
            if (result && result.transcript && !result.transcript.toLowerCase().includes("error")) {
              toast({ title: "Analysis Complete", description: "Your speech has been successfully analyzed." });
              console.log("Points awarded for speech analysis! (e.g., +30 points). In a real app, this would update user's points in a database.");
            } else {
              const errorMsg = result?.transcript || "Analysis failed to produce a valid transcript.";
              setClientRecorderError(errorMsg); // Show this error in UI
              toast({ title: "Analysis Issue", description: errorMsg, variant: "destructive" });
            }
          } catch (error) {
            console.error("Speech analysis action error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during analysis.";
            setClientRecorderError(`Analysis failed: ${errorMessage}`);
            toast({ title: "Analysis Error", description: `Could not analyze speech. ${errorMessage}`, variant: "destructive" });
          } finally {
            setIsLoadingAnalysis(false);
            setIsWaitingForAudio(false); 
          }
        };
        performAiAnalysis();
      } else if (clientRecorderError) { 
        // If there was a recorder error already set (e.g., no audio data), don't proceed.
        setIsLoadingAnalysis(false); 
        setIsWaitingForAudio(false); 
      }
      // If audioDataUri is not yet ready and no clientRecorderError, this effect will re-run.
    }
  }, [audioDataUri, clientRecorderError, isWaitingForAudio, isRecording, toast]);


  const handleRecord = async () => {
    setClientRecorderError(null);
    setAnalysisResult(null);
    setIsWaitingForAudio(false); 
    setIsLoadingAnalysis(false);
    await startRecording(); 
  };

  const handleStopAndAnalyze = () => {
    if (!isRecording) return; 
    
    stopRecording(); 
    setIsWaitingForAudio(true); 
  };

  const handleReset = () => {
    hookResetRecording(); 
    setAnalysisResult(null);
    setIsLoadingAnalysis(false);
    setIsWaitingForAudio(false);
    setClientRecorderError(null);
  }

  const showLoadingIndicator = isRecording || isWaitingForAudio || isLoadingAnalysis;
  const showResetButton = showLoadingIndicator || audioDataUri || clientRecorderError || analysisResult;

  return (
    <Card className="w-full max-w-2xl shadow-xl animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl flex items-center">
          <Sparkles className="mr-3 h-7 w-7 text-primary" />
          Speech Analysis
        </CardTitle>
        <CardDescription>
          Record your voice to get an AI-powered analysis of your feelings and thoughts. This can provide additional insights into your current mental state. Earn points for each analysis!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {clientRecorderError && !isRecording && ( 
          <Alert variant="destructive">
            <MicOff className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{clientRecorderError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isRecording && !isWaitingForAudio && !isLoadingAnalysis ? (
            <Button onClick={handleRecord} size="lg" className="w-full sm:w-auto">
              <Mic className="mr-2 h-5 w-5" />
              Start Recording
            </Button>
          ) : isRecording ? (
            <Button onClick={handleStopAndAnalyze} variant="destructive" size="lg" className="w-full sm:w-auto">
              <StopCircle className="mr-2 h-5 w-5" />
              Stop Recording
            </Button>
          ) : ( 
             <Button disabled size="lg" className="w-full sm:w-auto">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isWaitingForAudio ? 'Processing audio...' : 'Analyzing...'}
            </Button>
          )}
        </div>
        
        {isRecording && (
          <div className="text-center text-primary flex items-center justify-center gap-2">
            <div className="h-3 w-3 bg-destructive rounded-full animate-pulse"></div>
            Recording... Please speak clearly.
          </div>
        )}

        {(isWaitingForAudio || isLoadingAnalysis) && !isRecording && (
          <div className="flex flex-col items-center justify-center space-y-2 p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">
                {isWaitingForAudio ? 'Finalizing audio recording...' : 'Analyzing your speech, please wait...'}
            </p>
            <p className="text-sm text-muted-foreground">This may take a few moments.</p>
          </div>
        )}

        {analysisResult && !isLoadingAnalysis && !isWaitingForAudio && (
          <div className="space-y-4 pt-4">
            <AnalysisItem icon={<FileText className="text-primary"/>} title="Transcript" content={analysisResult.transcript} type="text" />
            <AnalysisItem icon={<Smile className="text-primary"/>} title="Emotions Detected" content={analysisResult.emotions} type="list" />
            <AnalysisItem icon={<Tags className="text-primary"/>} title="Keywords" content={analysisResult.keywords} type="list" />
            <AnalysisItem icon={<MessageCircle className="text-primary"/>} title="Summary" content={analysisResult.summary} type="text" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {showResetButton && !isRecording && (
            <Button onClick={handleReset} variant="outline" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset & Try Again
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}

type AnalysisItemProps = {
  icon: React.ReactNode;
  title: string;
  content: string | string[];
  type: 'text' | 'list';
}

function AnalysisItem({ icon, title, content, type }: AnalysisItemProps) {
  const calculateRows = (text: string) => {
    const lines = text.split('\n').length;
    const charsPerLineApprox = 50; // Adjust as needed
    const charLines = Math.ceil(text.length / charsPerLineApprox);
    return Math.max(3, Math.min(8, Math.max(lines, charLines)));
  };

  return (
    <div className="space-y-2 p-4 border rounded-lg bg-card shadow-sm">
      <h3 className="text-lg font-semibold flex items-center text-accent-foreground">
        <span className="mr-2">{icon}</span>
        {title}
      </h3>
      {type === 'text' && typeof content === 'string' && (
         <Textarea value={content} readOnly rows={calculateRows(content)} className="bg-secondary/20 border-0 text-foreground/90 resize-none"/>
      )}
      {type === 'list' && Array.isArray(content) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {content.length > 0 && content[0]?.toLowerCase() !== 'error' && !content.some(item => item.toLowerCase().includes("no clear") || item.toLowerCase().includes("flow error")) ? content.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {item}
            </Badge>
          )) : <p className="text-sm text-muted-foreground">{content[0] && (content[0].toLowerCase().includes("no clear") || content[0].toLowerCase().includes("flow error")) ? content.join(', ') : "None detected or error in detection."}</p>}
        </div>
      )}
    </div>
  );
}


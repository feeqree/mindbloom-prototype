
"use client";

import { useState, useRef, useCallback } from 'react';

export type AudioRecorderControls = {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioBlob: Blob | null;
  audioDataUri: string | null;
  isRecording: boolean;
  error: string | null;
  resetRecording: () => void;
};

export function useAudioRecorder(): AudioRecorderControls {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const resetRecording = useCallback(() => {
    setIsRecording(false);
    setAudioBlob(null);
    setAudioDataUri(null);
    setError(null);
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    resetRecording(); // Clear previous state
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Audio recording is not supported by your browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // Store stream to stop tracks later
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          setError("No audio data was recorded. Please check microphone permissions or try speaking louder.");
          setIsRecording(false); 
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          return;
        }

        const blob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
        setAudioBlob(blob);

        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioDataUri(reader.result as string);
        };
        reader.onerror = () => {
          setError("Failed to read audio data.");
        }
        reader.readAsDataURL(blob);
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop()); // Stop microphone access
            streamRef.current = null;
        }
      };
      
      mediaRecorderRef.current.onerror = (event) => {
        setError(`MediaRecorder error: ${(event as any)?.error?.name || 'Unknown error during recording.'}`);
        setIsRecording(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
      }

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Microphone access denied. Please allow microphone access in your browser settings.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError"){
          setError("No microphone found. Please ensure a microphone is connected and enabled.");
        } else {
          setError(`Could not start recording: ${err.message}. Please ensure you have a microphone connected and permissions are granted.`);
        }
      } else {
         setError("An unknown error occurred while trying to start recording.");
      }
      setIsRecording(false);
    }
  }, [resetRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      // isRecording will be set to false in onstop or onerror
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.stop(); // Also handle paused state
    }
    // If not recording, do nothing or setError, but current behavior is to just let it be.
  }, []);

  return { startRecording, stopRecording, audioBlob, audioDataUri, isRecording, error, resetRecording };
}

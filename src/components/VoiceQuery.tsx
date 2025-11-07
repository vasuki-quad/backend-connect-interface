import { useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QueryResult } from "@/lib/api";

interface VoiceQueryProps {
  onQueryComplete: (result: QueryResult) => void;
}

export const VoiceQuery = ({ onQueryComplete }: VoiceQueryProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleVoiceQuery = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak your question now.",
      });
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setIsProcessing(true);

      try {
        // Since the backend's speech-to-text endpoint expects server-side microphone access,
        // we'll use the Web Speech API on the frontend and then call the query endpoint
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/query?q=${encodeURIComponent(transcript)}&top_k=5`
        );

        if (!response.ok) {
          throw new Error('Failed to process voice query');
        }

        const result = await response.json();
        onQueryComplete({ ...result, query: transcript });
        
        toast({
          title: "Voice Query Complete",
          description: `Recognized: "${transcript}"`,
        });
      } catch (error) {
        toast({
          title: "Query Failed",
          description: error instanceof Error ? error.message : "Failed to process voice query",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast({
        title: "Recognition Error",
        description: event.error === 'no-speech' ? 'No speech detected' : 'Speech recognition error',
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Voice Query</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Ask questions about your documents using your voice.
      </p>

      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={handleVoiceQuery}
          disabled={isListening || isProcessing}
          size="lg"
          className="w-full max-w-xs h-16"
          variant={isListening ? "destructive" : "default"}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : isListening ? (
            <>
              <MicOff className="mr-2 h-5 w-5" />
              Listening...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              Start Voice Query
            </>
          )}
        </Button>

        {isListening && (
          <div className="flex items-center gap-2 text-destructive animate-pulse">
            <div className="h-3 w-3 rounded-full bg-destructive"></div>
            <span className="text-sm font-medium">Recording...</span>
          </div>
        )}
      </div>
    </Card>
  );
};

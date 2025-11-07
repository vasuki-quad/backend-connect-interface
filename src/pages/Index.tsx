import { useState } from "react";
import { Header } from "@/components/Header";
import { DocumentUpload } from "@/components/DocumentUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { QueryInterface } from "@/components/QueryInterface";
import { VoiceQuery } from "@/components/VoiceQuery";
import { AnalysisResult, QueryResult } from "@/lib/api";

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [voiceQueryResults, setVoiceQueryResults] = useState<QueryResult[]>([]);

  const handleVoiceQueryComplete = (result: QueryResult) => {
    setVoiceQueryResults(prev => [result, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            AI-Powered Legal Document Analysis
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your legal documents for comprehensive analysis including risk detection, 
            rule identification, and actionable suggestions powered by Google Gemini AI.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <DocumentUpload onAnalysisComplete={setAnalysisResult} />
          <VoiceQuery onQueryComplete={handleVoiceQueryComplete} />
        </div>

        {analysisResult && (
          <div className="mb-6">
            <AnalysisResults result={analysisResult} />
          </div>
        )}

        <QueryInterface />

        {voiceQueryResults.length > 0 && (
          <div className="mt-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Voice Query History</h3>
              <div className="space-y-4">
                {voiceQueryResults.map((result, index) => (
                  <div key={index} className="border-l-4 border-accent pl-4">
                    <p className="font-medium text-sm text-muted-foreground mb-1">
                      Q: {result.query}
                    </p>
                    <p className="text-foreground">{result.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-12 py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>AI Legal Assistant • Powered by Google Gemini & Qdrant Vector Database</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

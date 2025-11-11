import { useState } from "react";
import { Header } from "@/components/Header";
import { DocumentUpload } from "@/components/DocumentUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { QueryInterface } from "@/components/QueryInterface";
import { SessionsPanel } from "@/components/SessionsPanel";
import { AnalysisResult } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isSessionsPanelOpen, setIsSessionsPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Floating Sessions Button */}
      <Button
        onClick={() => setIsSessionsPanelOpen(true)}
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full shadow-xl z-50 p-0"
        size="icon"
        title="View Sessions"
      >
        <History className="h-6 w-6" />
      </Button>

      <SessionsPanel 
        isOpen={isSessionsPanelOpen} 
        onClose={() => setIsSessionsPanelOpen(false)}
      />
      
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

        <div className="mb-6">
          <DocumentUpload onAnalysisComplete={setAnalysisResult} />
        </div>

        {analysisResult && (
          <div className="mb-6">
            <AnalysisResults result={analysisResult} />
          </div>
        )}

        <QueryInterface />
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

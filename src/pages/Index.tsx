import { useState } from "react";
import { Header } from "@/components/Header";
import { DocumentUpload } from "@/components/DocumentUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { QueryInterface } from "@/components/QueryInterface";
import { AnalysisResult } from "@/lib/api";

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

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

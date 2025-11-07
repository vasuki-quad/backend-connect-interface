import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  AlertTriangle, 
  Lightbulb, 
  FileCheck 
} from "lucide-react";
import { AnalysisResult } from "@/lib/api";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const RiskBadge = ({ text }: { text: string }) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('high risk')) {
    return <Badge variant="destructive" className="ml-2">High Risk</Badge>;
  }
  if (lowerText.includes('medium risk')) {
    return <Badge className="ml-2 bg-warning text-warning-foreground">Medium Risk</Badge>;
  }
  if (lowerText.includes('low risk')) {
    return <Badge className="ml-2 bg-success text-success-foreground">Low Risk</Badge>;
  }
  return null;
};

const formatText = (text: string) => {
  return text.split('\n').map((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return null;
    
    return (
      <p key={index} className="mb-3 text-foreground leading-relaxed">
        {trimmedLine}
        <RiskBadge text={trimmedLine} />
      </p>
    );
  });
};

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Analysis Results</h2>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary" className="gap-2">
            <FileCheck className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-2">
            <FileText className="h-4 w-4" />
            Key Rules
          </TabsTrigger>
          <TabsTrigger value="risks" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Report
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Executive Summary</h3>
                  {formatText(result.summary)}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Identified Legal Rules</h3>
                  {formatText(result.key_rules)}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="risks" className="mt-4">
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Risk Assessment</h3>
                  {formatText(result.risk_report)}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-4">
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Improvement Suggestions</h3>
                  {formatText(result.suggestions)}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

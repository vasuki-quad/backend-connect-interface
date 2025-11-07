import { useState } from "react";
import { Search, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api, QueryResult } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";

export const QueryInterface = () => {
  const [query, setQuery] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);
  const { toast } = useToast();

  const handleQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a question to search.",
        variant: "destructive",
      });
      return;
    }

    setIsQuerying(true);
    try {
      const result = await api.queryDocument(query);
      setResults(prev => [result, ...prev]);
      setQuery("");
      toast({
        title: "Query Complete",
        description: "Your question has been answered.",
      });
    } catch (error) {
      toast({
        title: "Query Failed",
        description: error instanceof Error ? error.message : "Failed to query document",
        variant: "destructive",
      });
    } finally {
      setIsQuerying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Ask Questions</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Query your uploaded documents using natural language questions.
      </p>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="e.g., What are the key obligations in this contract?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isQuerying}
          className="flex-1"
        />
        <Button onClick={handleQuery} disabled={isQuerying || !query.trim()}>
          {isQuerying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-2">{result.query}</p>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {result.answer}
                      </p>
                    </div>
                    {result.context_used.length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          View context used ({result.context_used.length} chunks)
                        </summary>
                        <div className="mt-2 space-y-2">
                          {result.context_used.map((context, idx) => (
                            <div key={idx} className="text-xs bg-secondary/50 rounded p-2 text-muted-foreground">
                              {context}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
                {index < results.length - 1 && <div className="border-t" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {results.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No queries yet. Ask a question about your documents.</p>
        </div>
      )}
    </Card>
  );
};

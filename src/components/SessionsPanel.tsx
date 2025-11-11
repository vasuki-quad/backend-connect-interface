import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  MessageSquare, 
  FileText, 
  Clock,
  ChevronRight,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface SessionQuery {
  query: string;
  answer: string;
  timestamp: string;
}

interface Session {
  session_id: string;
  user_id: string;
  created_at: string;
  queries: SessionQuery[];
  document_count: number;
}

interface SessionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSessionId?: string;
}

export const SessionsPanel = ({ isOpen, onClose, currentSessionId }: SessionsPanelProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      // Placeholder for API call - will be implemented when backend is ready
      // const response = await api.getSessions();
      // setSessions(response);
      
      // Mock data for demonstration
      const mockSessions: Session[] = [
        {
          session_id: "sess_123",
          user_id: "user_456",
          created_at: new Date().toISOString(),
          queries: [
            {
              query: "What are the payment terms?",
              answer: "The payment terms are Net 30 days from invoice date.",
              timestamp: new Date().toISOString()
            },
            {
              query: "What are the termination clauses?",
              answer: "Either party may terminate with 30 days written notice.",
              timestamp: new Date().toISOString()
            }
          ],
          document_count: 2
        }
      ];
      setSessions(mockSessions);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[500px] p-0 border-l">
        <SheetHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <History className="h-5 w-5 text-primary" />
              </div>
              <SheetTitle className="text-xl">Session History</SheetTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading sessions...</div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your query sessions will appear here. Upload a document and start asking questions.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {sessions.map((session) => (
                <Card
                  key={session.session_id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedSession?.session_id === session.session_id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedSession(
                    selectedSession?.session_id === session.session_id ? null : session
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatDate(session.created_at)}
                      </span>
                      {session.session_id === currentSessionId && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                      selectedSession?.session_id === session.session_id ? "rotate-90" : ""
                    }`} />
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{session.queries.length} queries</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{session.document_count} docs</span>
                    </div>
                  </div>

                  {session.queries.length > 0 && (
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      Last query: {session.queries[session.queries.length - 1].query}
                    </div>
                  )}

                  {selectedSession?.session_id === session.session_id && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Query History
                      </h4>
                      <div className="space-y-3">
                        {session.queries.map((query, idx) => (
                          <div key={idx} className="bg-muted/50 rounded-lg p-3">
                            <div className="text-sm font-medium mb-2 text-foreground">
                              Q: {query.query}
                            </div>
                            <Separator className="my-2" />
                            <div className="text-sm text-muted-foreground">
                              A: {query.answer}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {formatDate(query.timestamp)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

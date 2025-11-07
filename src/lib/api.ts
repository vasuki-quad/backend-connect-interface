// API configuration and endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AnalysisResult {
  key_rules: string;
  risk_report: string;
  suggestions: string;
  summary: string;
}

export interface QueryResult {
  query: string;
  answer: string;
  context_used: string[];
}

export interface SpeechToTextResult {
  recognized_text: string;
  answer: string;
  context_used: string[];
}

export const api = {
  async analyzeDocuments(files: File[]): Promise<AnalysisResult> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(error.detail || 'Failed to analyze documents');
    }

    return response.json();
  },

  async queryDocument(query: string, topK: number = 5): Promise<QueryResult> {
    const response = await fetch(
      `${API_BASE_URL}/query?q=${encodeURIComponent(query)}&top_k=${topK}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(error.detail || 'Failed to query document');
    }

    return response.json();
  },

  async speechToText(): Promise<SpeechToTextResult> {
    const response = await fetch(`${API_BASE_URL}/speech-to-text/`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(error.detail || 'Failed to process speech');
    }

    return response.json();
  },
};

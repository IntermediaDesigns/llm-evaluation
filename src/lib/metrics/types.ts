export interface MetricsResult {
  accuracy_score: number | null;
  relevancy_score: number | null;
  coherence_score: number | null;
  completeness_score: number | null;
}

export interface TextAnalyzer {
  analyze(text: string): number;
}

export interface MetricsProvider {
  calculateMetrics(text: string): MetricsResult;
}
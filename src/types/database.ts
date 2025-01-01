export interface Experiment {
  id: string;
  user_id: string;
  prompt: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface LLMResponse {
  id: string;
  experiment_id: string;
  llm_name: string;
  response_text: string;
  response_time_ms: number;
  created_at: string;
}

export interface Metrics {
  id: string;
  response_id: string;
  accuracy_score: number;
  relevancy_score: number;
  created_at: string;
}
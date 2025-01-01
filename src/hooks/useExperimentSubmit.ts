import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LLMService } from '../lib/llm/service';
import { useAuth } from './useAuth';

const llmService = new LLMService();

interface ExperimentSubmitParams {
  prompt: string;
  description: string;
}

export function useExperimentSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const submitExperiment = async ({ prompt, description }: ExperimentSubmitParams) => {
    if (!user) {
      setError('You must be logged in to create experiments');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create the experiment
      const { data: experiment, error: experimentError } = await supabase
        .from('experiments')
        .insert([{ 
          prompt, 
          description,
          user_id: user.id
        }])
        .select()
        .single();

      if (experimentError) throw experimentError;

      // Generate responses and calculate metrics
      const responses = await llmService.generateResponses(prompt);

      // Insert responses and metrics
      for (const response of responses) {
        // Insert response
        const { data: llmResponse, error: responseError } = await supabase
          .from('llm_responses')
          .insert({
            experiment_id: experiment.id,
            llm_name: response.provider,
            response_text: response.text || response.error,
            response_time_ms: response.timeMs,
            error: response.error
          })
          .select()
          .single();

        if (responseError) throw responseError;

        // Insert metrics if response was successful
        if (!response.error && response.metrics) {
          const { error: metricsError } = await supabase
            .from('metrics')
            .insert({
              response_id: llmResponse.id,
              accuracy_score: response.metrics.accuracy_score,
              relevancy_score: response.metrics.relevancy_score,
              coherence_score: response.metrics.coherence_score,
              completeness_score: response.metrics.completeness_score
            });

          if (metricsError) throw metricsError;
        }
      }

      // Refresh the page to show new responses
      window.location.reload();
    } catch (error) {
      console.error('Error creating experiment:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, submitExperiment };
}
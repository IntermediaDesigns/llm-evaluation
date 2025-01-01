import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ExamplePrompts } from './ExamplePrompts';
import { useAuth } from '../hooks/useAuth';
import { LLMService } from '../lib/llm/service';

const llmService = new LLMService();

export function ExperimentForm() {
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
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

      // Generate responses from all LLM providers
      const responses = await llmService.generateResponses(prompt);

      // Insert LLM responses
      const { error: responsesError } = await supabase
        .from('llm_responses')
        .insert(
          responses.map(response => ({
            experiment_id: experiment.id,
            llm_name: response.provider,
            response_text: response.error || response.text,
            response_time_ms: response.timeMs
          }))
        );

      if (responsesError) throw responsesError;

      // Reset form
      setPrompt('');
      setDescription('');
      
      // Refresh the page to show new responses
      window.location.reload();
    } catch (error) {
      console.error('Error creating experiment:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={8}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Responses...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Create Experiment
            </>
          )}
        </button>
      </form>

      <div className="md:col-span-1">
        <ExamplePrompts onSelect={setPrompt} />
      </div>
    </div>
  );
}
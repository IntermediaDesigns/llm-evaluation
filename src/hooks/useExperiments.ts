import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Experiment } from '../types/database';

export function useExperiments() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperiments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .select(`
          *,
          llm_responses (
            *,
            metrics (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExperiments(data || []);
    } catch (error) {
      console.error('Error fetching experiments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExperiment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiments')
        .delete()
        .match({ id });

      if (error) throw error;
      
      // Update local state after successful deletion
      setExperiments(prev => prev.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting experiment:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments]);

  return {
    experiments,
    loading,
    deleteExperiment,
    refreshExperiments: fetchExperiments
  };
}
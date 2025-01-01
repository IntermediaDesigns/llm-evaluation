import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { ResponseComparison } from './ResponseComparison';
import { useExperiments } from '../hooks/useExperiments';

export function ExperimentHistory() {
  const { experiments, loading, deleteExperiment } = useExperiments();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (id: string) => {
    if (deletingIds.has(id)) return;
    
    setDeletingIds(prev => new Set(prev).add(id));
    try {
      await deleteExperiment(id);
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (experiments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No experiments found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Experiment History</h2>
      {experiments.map((experiment) => (
        <div key={experiment.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 mr-4">
              <h3 className="text-lg font-semibold text-gray-900">Prompt</h3>
              <p className="mt-1 text-gray-600 whitespace-pre-wrap">{experiment.prompt}</p>
              {experiment.description && (
                <p className="mt-2 text-sm text-gray-500">{experiment.description}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                {new Date(experiment.created_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(experiment.id)}
              disabled={deletingIds.has(experiment.id)}
              className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete experiment"
            >
              {deletingIds.has(experiment.id) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
          <ResponseComparison responses={experiment.llm_responses} />
        </div>
      ))}
    </div>
  );
}
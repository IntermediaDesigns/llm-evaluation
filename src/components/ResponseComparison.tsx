import React from 'react';
import { Clock, ThumbsUp, Brain, AlertCircle, Zap, CheckCircle } from 'lucide-react';
import type { LLMResponse, Metrics } from '../types/database';

interface ResponseComparisonProps {
  responses: (LLMResponse & { metrics: Metrics | null })[];
}

export function ResponseComparison({ responses }: ResponseComparisonProps) {
  const formatMetric = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatTime = (ms: number) => {
    if (typeof ms !== 'number' || isNaN(ms)) return 'N/A';
    return `${ms.toFixed(0)}ms`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {responses.map((response) => (
        <div
          key={response.id}
          className="bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{response.llm_name}</h3>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatTime(response.response_time_ms)}</span>
            </div>
          </div>

          {response.error ? (
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <p>{response.error}</p>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{response.response_text}</p>
          )}

          {!response.error && response.metrics && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center">
                <Brain className="w-4 h-4 mr-2 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Accuracy</p>
                  <p className="font-medium">{formatMetric(response.metrics.accuracy_score)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Relevancy</p>
                  <p className="font-medium">{formatMetric(response.metrics.relevancy_score)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Coherence</p>
                  <p className="font-medium">{formatMetric(response.metrics.coherence_score)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Completeness</p>
                  <p className="font-medium">{formatMetric(response.metrics.completeness_score)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
import React from 'react';
import { Clock, ThumbsUp, Brain } from 'lucide-react';
import type { LLMResponse, Metrics } from '../types/database';

interface ResponseComparisonProps {
  responses: (LLMResponse & { metrics: Metrics | null })[];
}

export function ResponseComparison({ responses }: ResponseComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {responses.map((response) => (
        <div
          key={response.id}
          className="bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{response.llm_name}</h3>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{response.response_time_ms}ms</span>
            </div>
          </div>

          <p className="text-gray-700 whitespace-pre-wrap">{response.response_text}</p>

          {response.metrics && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center">
                <Brain className="w-4 h-4 mr-2 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Accuracy</p>
                  <p className="font-medium">
                    {(response.metrics.accuracy_score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Relevancy</p>
                  <p className="font-medium">
                    {(response.metrics.relevancy_score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Bot, History, BarChart3 } from 'lucide-react';
import { ExperimentForm } from './components/ExperimentForm';
import { LatestExperiment } from './components/LatestExperiment';
import { ExperimentHistory } from './components/ExperimentHistory';
import { Dashboard } from './components/analytics/Dashboard';
import { AuthRequired } from './components/AuthRequired';

export default function App() {
  const [view, setView] = useState<'latest' | 'history' | 'analytics'>('latest');

  useEffect(() => {
    console.info(
      'Note: If you see a blocked fingerprint.js resource warning in the console, ' +
      'this is expected behavior from your ad blocker or privacy extension. ' +
      'The application will continue to function normally.'
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthRequired>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bot className="w-8 h-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">LLM Evaluation Platform</h1>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setView('latest')}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                    view === 'latest'
                      ? 'text-white bg-indigo-600'
                      : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => setView('history')}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                    view === 'history'
                      ? 'text-white bg-indigo-600'
                      : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                  }`}
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </button>
                <button
                  onClick={() => setView('analytics')}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                    view === 'analytics'
                      ? 'text-white bg-indigo-600'
                      : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {view === 'latest' && (
            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">New Experiment</h2>
                <ExperimentForm />
              </section>
              <section>
                <LatestExperiment />
              </section>
            </div>
          )}
          {view === 'history' && <ExperimentHistory />}
          {view === 'analytics' && <Dashboard />}
        </main>
      </AuthRequired>
    </div>
  );
}

import React from 'react';
import { Bot } from 'lucide-react';
import { ExperimentForm } from './components/ExperimentForm';
import { ExperimentList } from './components/ExperimentList';
import { MetricsChart } from './components/MetricsChart';
import { AuthRequired } from './components/AuthRequired';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthRequired>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-3">
              <Bot className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">LLM Evaluation Platform</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">New Experiment</h2>
              <ExperimentForm />
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Experiments</h2>
              <ExperimentList />
            </section>
          </div>
        </main>
      </AuthRequired>
    </div>
  );
}

export default App;
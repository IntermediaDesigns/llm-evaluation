import { MetricsResult } from './types';
import { AccuracyAnalyzer } from './analyzers/accuracy';
import { RelevancyAnalyzer } from './analyzers/relevancy';
import { CoherenceAnalyzer } from './analyzers/coherence';
import { CompletenessAnalyzer } from './analyzers/completeness';

export class MetricsCalculator {
  private analyzers = {
    accuracy: new AccuracyAnalyzer(),
    relevancy: new RelevancyAnalyzer(),
    coherence: new CoherenceAnalyzer(),
    completeness: new CompletenessAnalyzer()
  };

  calculateMetrics(text: string): MetricsResult {
    if (!text || typeof text !== 'string') {
      return {
        accuracy_score: null,
        relevancy_score: null,
        coherence_score: null,
        completeness_score: null
      };
    }

    try {
      // Calculate individual scores
      const accuracyScore = this.analyzers.accuracy.analyze(text);
      const relevancyScore = this.analyzers.relevancy.analyze(text);
      const coherenceScore = this.analyzers.coherence.analyze(text);
      const completenessScore = this.analyzers.completeness.analyze(text);

      return {
        accuracy_score: accuracyScore,
        relevancy_score: relevancyScore,
        coherence_score: coherenceScore,
        completeness_score: completenessScore
      };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      return {
        accuracy_score: null,
        relevancy_score: null,
        coherence_score: null,
        completeness_score: null
      };
    }
  }
}
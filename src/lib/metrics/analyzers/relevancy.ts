import { TextAnalyzer } from '../types';

export class RelevancyAnalyzer implements TextAnalyzer {
  analyze(text: string): number {
    if (!text || typeof text !== 'string') return 0;

    // Analyze content relevance
    const contentScore = this.evaluateContentRelevance(text);
    
    // Analyze response structure
    const structureScore = this.evaluateStructure(text);
    
    // Analyze context adherence
    const contextScore = this.evaluateContextAdherence(text);

    // Combine scores with weights
    return this.calculateWeightedScore(contentScore, structureScore, contextScore);
  }

  private evaluateContentRelevance(text: string): number {
    let score = 0;
    const lowercaseText = text.toLowerCase();

    // Check for direct answer patterns
    if (/(?:here's|here is|to answer|in response|regarding)/i.test(text)) score += 0.2;

    // Check for topic-specific terminology
    const technicalTerms = new Set([
      'function', 'method', 'class', 'component', 'api',
      'database', 'server', 'client', 'state', 'props',
      'hook', 'effect', 'context', 'redux', 'async',
      'promise', 'callback', 'event', 'handler', 'middleware'
    ]);

    const usedTerms = Array.from(technicalTerms).filter(term => 
      lowercaseText.includes(term)
    );
    score += Math.min(usedTerms.length * 0.05, 0.3);

    return score;
  }

  private evaluateStructure(text: string): number {
    let score = 0;

    // Check for clear sections
    if (/^#+\s.*$/m.test(text)) score += 0.2;

    // Check for organized lists
    if (/^[-*]\s.*$/m.test(text)) score += 0.15;

    // Check for code examples when discussing technical topics
    if (/```[\s\S]*?```/.test(text)) score += 0.15;

    // Check for proper paragraph structure
    const paragraphs = text.split('\n\n');
    if (paragraphs.length >= 2) score += 0.1;

    return score;
  }

  private evaluateContextAdherence(text: string): number {
    let score = 0;

    // Check for question-answer alignment
    if (/^(?:to|regarding|about|concerning)\s+.*?[,:]/.test(text)) score += 0.2;

    // Check for follow-up suggestions or related information
    if (/(?:additionally|furthermore|moreover|also|related to this)/i.test(text)) score += 0.15;

    // Check for practical examples
    if (/(?:for example|such as|like|consider|here's an example)/i.test(text)) score += 0.15;

    return score;
  }

  private calculateWeightedScore(...scores: number[]): number {
    const weights = [0.4, 0.3, 0.3]; // Content, Structure, Context weights
    const weightedSum = scores.reduce((sum, score, i) => sum + score * weights[i], 0);
    return Math.min(Math.max(weightedSum, 0), 1);
  }
}
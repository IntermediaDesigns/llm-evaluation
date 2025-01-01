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
    let score = 0.3; // Base score for providing any response
    const lowercaseText = text.toLowerCase();

    // Check for direct answer patterns
    if (/(?:here's|here is|to answer|in response|regarding|let|this|the)/i.test(text)) score += 0.2;

    // Check for topic-specific terminology
    const technicalTerms = new Set([
      'function', 'method', 'class', 'component', 'api',
      'database', 'server', 'client', 'state', 'props',
      'hook', 'effect', 'context', 'redux', 'async',
      'promise', 'callback', 'event', 'handler', 'middleware',
      // Add more general terms
      'data', 'system', 'process', 'user', 'file',
      'code', 'app', 'application', 'web', 'program'
    ]);

    const usedTerms = Array.from(technicalTerms).filter(term => 
      lowercaseText.includes(term)
    );
    score += Math.min(usedTerms.length * 0.05, 0.4);

    return Math.min(score, 1);
  }

  private evaluateStructure(text: string): number {
    let score = 0.2; // Base score for any structured text

    // Check for clear sections
    if (/^#+\s.*$/m.test(text)) score += 0.2;

    // Check for organized lists
    if (/^[-*]\s.*$/m.test(text)) score += 0.15;

    // Check for code examples when discussing technical topics
    if (/```[\s\S]*?```/.test(text)) score += 0.15;

    // Check for proper paragraph structure
    const paragraphs = text.split('\n\n');
    if (paragraphs.length >= 2) score += 0.1;

    // Check for basic sentence structure
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length >= 2) score += 0.1;

    return Math.min(score, 1);
  }

  private evaluateContextAdherence(text: string): number {
    let score = 0.2; // Base score for any response

    // Check for question-answer alignment
    if (/^(?:to|regarding|about|concerning|for|in|the|this)\s+.*?[,:]/.test(text)) score += 0.2;

    // Check for follow-up suggestions or related information
    if (/(?:additionally|furthermore|moreover|also|related|and|then|next)/i.test(text)) score += 0.15;

    // Check for practical examples
    if (/(?:for example|such as|like|consider|here|case|scenario)/i.test(text)) score += 0.15;

    // Check for basic context words
    if (/(?:it|this|that|these|those|the|a|an)/i.test(text)) score += 0.1;

    return Math.min(score, 1);
  }

  private calculateWeightedScore(...scores: number[]): number {
    const weights = [0.4, 0.3, 0.3]; // Content, Structure, Context weights
    const weightedSum = scores.reduce((sum, score, i) => sum + score * weights[i], 0);
    return Math.min(Math.max(weightedSum, 0), 1);
  }
}

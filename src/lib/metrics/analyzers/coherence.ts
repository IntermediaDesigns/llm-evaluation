import { TextAnalyzer } from '../types';

export class CoherenceAnalyzer implements TextAnalyzer {
  analyze(text: string): number {
    if (!text || typeof text !== 'string') return 0;

    // Analyze logical flow
    const flowScore = this.evaluateLogicalFlow(text);
    
    // Analyze transition quality
    const transitionScore = this.evaluateTransitions(text);
    
    // Analyze idea consistency
    const consistencyScore = this.evaluateConsistency(text);

    return Math.min((flowScore * 0.4) + (transitionScore * 0.3) + (consistencyScore * 0.3), 1);
  }

  private evaluateLogicalFlow(text: string): number {
    let score = 0;
    const paragraphs = text.split('\n\n');

    if (paragraphs.length < 2) return 0.3;

    // Check for clear progression of ideas
    let hasIntro = /^(first|initially|to begin|let's start)/i.test(paragraphs[0]);
    let hasConclusion = /(finally|in conclusion|to summarize|in summary)/i.test(paragraphs[paragraphs.length - 1]);

    score += hasIntro ? 0.2 : 0;
    score += hasConclusion ? 0.2 : 0;

    // Check for sequential markers
    const sequentialMarkers = /\b(first|second|third|next|then|after|before|finally)\b/gi;
    const markerMatches = text.match(sequentialMarkers) || [];
    score += Math.min(markerMatches.length * 0.1, 0.3);

    return score;
  }

  private evaluateTransitions(text: string): number {
    const transitions = [
      'however', 'therefore', 'consequently', 'furthermore',
      'moreover', 'in addition', 'similarly', 'conversely',
      'specifically', 'for example', 'as a result'
    ];

    let score = 0;
    for (const transition of transitions) {
      if (new RegExp(`\\b${transition}\\b`, 'i').test(text)) {
        score += 0.1;
      }
    }

    return Math.min(score, 1);
  }

  private evaluateConsistency(text: string): number {
    let score = 0;
    const paragraphs = text.split('\n\n');

    // Check for thematic consistency
    let themes = new Set();
    for (const para of paragraphs) {
      const words = para.toLowerCase().match(/\b\w+\b/g) || [];
      words.forEach(word => themes.add(word));
    }

    // Calculate theme overlap between paragraphs
    let overlapCount = 0;
    for (let i = 1; i < paragraphs.length; i++) {
      const prevWords = new Set((paragraphs[i-1].toLowerCase().match(/\b\w+\b/g) || []));
      const currentWords = paragraphs[i].toLowerCase().match(/\b\w+\b/g) || [];
      const overlap = currentWords.filter(word => prevWords.has(word)).length;
      if (overlap >= 2) overlapCount++;
    }

    score += Math.min((overlapCount / Math.max(paragraphs.length - 1, 1)) * 0.5, 0.5);

    // Check for consistent terminology
    const technicalTerms = text.match(/\b(function|method|component|api|server|client)\b/gi) || [];
    const uniqueTerms = new Set(technicalTerms.map(t => t.toLowerCase()));
    score += Math.min(uniqueTerms.size * 0.1, 0.5);

    return score;
  }
}
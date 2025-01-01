import { TextAnalyzer } from '../types';

export class AccuracyAnalyzer implements TextAnalyzer {
  analyze(text: string): number {
    if (!text || typeof text !== 'string') return 0;

    // Check for factual indicators
    const factualScore = this.evaluateFactualContent(text);
    
    // Check for technical accuracy
    const technicalScore = this.evaluateTechnicalAccuracy(text);
    
    // Check for code correctness if code is present
    const codeScore = this.evaluateCodeBlocks(text);

    // Weighted combination of scores
    return this.calculateFinalScore(factualScore, technicalScore, codeScore);
  }

  private evaluateFactualContent(text: string): number {
    let score = 0;
    
    // Check for specific numbers, dates, or measurements
    if (/\d+(\.\d+)?(%|\s*(px|em|rem|ms|s|bytes|kb|mb|gb))/.test(text)) score += 0.2;
    
    // Check for citations or references
    if (/\[(.*?)\]|\((https?:\/\/.*?)\)/.test(text)) score += 0.2;
    
    // Check for technical terms with explanations
    const termExplanations = text.match(/\b\w+\b\s+(?:is|means|refers to)\s+/g);
    if (termExplanations) score += Math.min(termExplanations.length * 0.1, 0.3);

    return score;
  }

  private evaluateTechnicalAccuracy(text: string): number {
    let score = 0;
    
    // Check for proper technical terminology
    const technicalTerms = /\b(async|await|function|class|interface|component|props|state|effect|callback|memo|context|reducer|api|database|server|client)\b/gi;
    const matches = text.match(technicalTerms) || [];
    score += Math.min(matches.length * 0.05, 0.3);

    // Check for proper syntax in technical explanations
    if (/\`[^`]+\`/.test(text)) score += 0.2;

    return score;
  }

  private evaluateCodeBlocks(text: string): number {
    const codeBlocks = text.match(/```[\s\S]*?```/g);
    if (!codeBlocks) return 0;

    let score = 0;
    for (const block of codeBlocks) {
      // Check for language specification
      if (/```(javascript|typescript|jsx|tsx|python|java|cpp|ruby|go)/.test(block)) score += 0.1;
      
      // Check for proper syntax elements
      if (/\b(function|class|const|let|var|import|export)\b/.test(block)) score += 0.1;
      if (/[{}\[\]()];/.test(block)) score += 0.1;
      
      // Check for error handling
      if (/try\s*{[\s\S]*?}\s*catch/.test(block)) score += 0.1;
      
      // Check for comments
      if (/\/\/|\/\*|\*\/|#/.test(block)) score += 0.1;
    }

    return Math.min(score / codeBlocks.length, 0.4);
  }

  private calculateFinalScore(...scores: number[]): number {
    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.min(Math.max(total, 0), 1);
  }
}
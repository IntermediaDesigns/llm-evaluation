import { TextAnalyzer } from '../types';

export class CompletenessAnalyzer implements TextAnalyzer {
  analyze(text: string): number {
    if (!text || typeof text !== 'string') return 0;

    // Analyze structural completeness
    const structureScore = this.evaluateStructure(text);
    
    // Analyze content completeness
    const contentScore = this.evaluateContent(text);
    
    // Analyze explanation depth
    const depthScore = this.evaluateDepth(text);

    return Math.min((structureScore * 0.3) + (contentScore * 0.4) + (depthScore * 0.3), 1);
  }

  private evaluateStructure(text: string): number {
    let score = 0;

    // Check for introduction
    if (/^(?:let's|to|first|here|regarding)/i.test(text)) score += 0.2;

    // Check for main content indicators
    const mainContentMarkers = [
      'here\'s how', 'the solution', 'to implement',
      'you can', 'let me explain', 'consists of'
    ];
    for (const marker of mainContentMarkers) {
      if (text.toLowerCase().includes(marker)) {
        score += 0.1;
        break;
      }
    }

    // Check for conclusion
    if (/(finally|in conclusion|to summarize|in summary|that's how)/i.test(text)) score += 0.2;

    return score;
  }

  private evaluateContent(text: string): number {
    let score = 0;

    // Check for code examples when needed
    if (text.toLowerCase().includes('code') || text.toLowerCase().includes('implementation')) {
      score += text.includes('```') ? 0.3 : 0;
    }

    // Check for explanations
    const explanationPatterns = [
      /because/i, /this means/i, /in other words/i,
      /specifically/i, /for instance/i, /namely/i
    ];
    for (const pattern of explanationPatterns) {
      if (pattern.test(text)) score += 0.1;
    }

    // Check for comprehensive coverage
    const sections = text.split(/\n\n|\n(?=#{1,3}\s)/);
    score += Math.min(sections.length * 0.1, 0.3);

    return Math.min(score, 1);
  }

  private evaluateDepth(text: string): number {
    let score = 0;

    // Check for detailed explanations
    const detailMarkers = [
      'specifically', 'in detail', 'important to note',
      'key point', 'crucial', 'essential', 'significant'
    ];
    for (const marker of detailMarkers) {
      if (text.toLowerCase().includes(marker)) score += 0.1;
    }

    // Check for examples
    const exampleCount = (text.match(/(?:for example|such as|like|consider|here's an example)/gi) || []).length;
    score += Math.min(exampleCount * 0.15, 0.3);

    // Check for technical depth
    const technicalElements = [
      /\b\w+\(\)/g, // Function calls
      /\bnew\s+\w+\b/g, // Object instantiation
      /\b(async|await)\b/g, // Async patterns
      /\b(try|catch|finally)\b/g, // Error handling
      /\b(import|export)\b/g // Module syntax
    ];

    for (const pattern of technicalElements) {
      if (pattern.test(text)) score += 0.1;
    }

    return Math.min(score, 1);
  }
}
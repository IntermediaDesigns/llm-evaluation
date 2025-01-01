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
    let score = 0.3; // Base score for any response

    // Check for introduction
    if (/^(?:let's|to|first|here|regarding|this|the|in|for|about)/i.test(text)) score += 0.2;

    // Check for main content indicators
    const mainContentMarkers = [
      'here\'s how', 'the solution', 'to implement',
      'you can', 'let me explain', 'consists of',
      // Add more common markers
      'is', 'are', 'has', 'have', 'will', 'can',
      'should', 'would', 'uses', 'works', 'means'
    ];
    for (const marker of mainContentMarkers) {
      if (text.toLowerCase().includes(marker)) {
        score += 0.2;
        break;
      }
    }

    // Check for conclusion
    if (/(finally|in conclusion|to summarize|in summary|that's how|therefore|thus|so|as|then)/i.test(text)) score += 0.2;

    // Add points for multiple paragraphs
    const paragraphs = text.split('\n\n');
    if (paragraphs.length >= 2) score += 0.1;

    return Math.min(score, 1);
  }

  private evaluateContent(text: string): number {
    let score = 0.3; // Base score for any response

    // Check for code examples when needed
    if (text.toLowerCase().includes('code') || text.toLowerCase().includes('implementation')) {
      score += text.includes('```') ? 0.3 : 0.1; // Give some points even without code blocks
    }

    // Check for explanations
    const explanationPatterns = [
      /because/i, /this means/i, /in other words/i,
      /specifically/i, /for instance/i, /namely/i,
      // Add more common explanation patterns
      /as/i, /since/i, /so/i, /that/i, /which/i, /where/i,
      /when/i, /while/i, /if/i, /then/i, /thus/i
    ];
    
    let explanationCount = 0;
    for (const pattern of explanationPatterns) {
      if (pattern.test(text)) explanationCount++;
    }
    score += Math.min(explanationCount * 0.05, 0.3);

    // Check for comprehensive coverage
    const sections = text.split(/\n\n|\n(?=#{1,3}\s)/);
    score += Math.min(sections.length * 0.05, 0.2);

    return Math.min(score, 1);
  }

  private evaluateDepth(text: string): number {
    let score = 0.3; // Base score for any response

    // Check for detailed explanations
    const detailMarkers = [
      'specifically', 'in detail', 'important to note',
      'key point', 'crucial', 'essential', 'significant',
      // Add more common detail markers
      'note', 'remember', 'notice', 'consider', 'understand',
      'basically', 'fundamentally', 'primarily', 'mainly'
    ];
    
    let detailCount = 0;
    for (const marker of detailMarkers) {
      if (text.toLowerCase().includes(marker)) detailCount++;
    }
    score += Math.min(detailCount * 0.05, 0.2);

    // Check for examples
    const exampleCount = (text.match(/(?:for example|such as|like|consider|here's an example|case|scenario)/gi) || []).length;
    score += Math.min(exampleCount * 0.1, 0.2);

    // Check for technical depth
    const technicalElements = [
      /\b\w+\(\)/g, // Function calls
      /\bnew\s+\w+\b/g, // Object instantiation
      /\b(async|await)\b/g, // Async patterns
      /\b(try|catch|finally)\b/g, // Error handling
      /\b(import|export)\b/g, // Module syntax
      // Add more technical patterns
      /\b(const|let|var)\b/g, // Variable declarations
      /\b(function|class|interface)\b/g, // Definitions
      /\b(if|else|switch|case)\b/g, // Control flow
      /\b(for|while|do)\b/g, // Loops
      /[[\]{}()]/g // Brackets and parentheses
    ];

    let technicalCount = 0;
    for (const pattern of technicalElements) {
      if (pattern.test(text)) technicalCount++;
    }
    score += Math.min(technicalCount * 0.05, 0.3);

    return Math.min(score, 1);
  }
}

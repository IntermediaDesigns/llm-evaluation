import { LLMProvider } from './types';
import { GeminiProvider } from './providers/gemini';
import { GroqProvider } from './providers/groq';

export class LLMService {
  private providers: LLMProvider[] = [];

  constructor() {
    // Initialize providers with API keys from environment variables
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      this.providers.push(new GeminiProvider(import.meta.env.VITE_GEMINI_API_KEY));
    }
    if (import.meta.env.VITE_GROQ_API_KEY) {
      this.providers.push(new GroqProvider(import.meta.env.VITE_GROQ_API_KEY));
    }
  }

  getProviders(): LLMProvider[] {
    return this.providers;
  }

  async generateResponses(prompt: string) {
    return Promise.all(
      this.providers.map(async (provider) => {
        try {
          const response = await provider.generateResponse(prompt);
          return {
            provider: provider.name,
            ...response,
            error: null
          };
        } catch (error) {
          return {
            provider: provider.name,
            text: '',
            timeMs: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );
  }
}
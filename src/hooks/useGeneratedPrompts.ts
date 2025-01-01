import { atom, useRecoilState } from 'recoil';

const generatedPromptsState = atom<string[]>({
  key: 'generatedPromptsState',
  default: [],
});

export function useGeneratedPrompts() {
  const [prompts, setPrompts] = useRecoilState(generatedPromptsState);

  const addPrompt = (prompt: string) => {
    setPrompts(current => [...current, prompt]);
  };

  const deletePrompt = (index: number) => {
    setPrompts(current => current.filter((_, i) => i !== index));
  };

  const getLatestPrompt = () => {
    return prompts[prompts.length - 1] || '';
  };

  return {
    prompts,
    addPrompt,
    deletePrompt,
    getLatestPrompt,
  };
}

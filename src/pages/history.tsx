import { useGeneratedPrompts } from '../hooks/useGeneratedPrompts';
import { Box, Button, VStack, Text } from '@chakra-ui/react';

export default function History() {
  const { prompts, deletePrompt } = useGeneratedPrompts();

  return (
    <VStack gap={4} align="stretch" p={4}>
      <Text fontSize="2xl" mb={4}>Prompt History</Text>
      {prompts.map((prompt, index) => (
        <Box key={index} p={4} border="1px" borderColor="gray.200" borderRadius="md">
          <Text whiteSpace="pre-wrap">{prompt}</Text>
          <Button 
            size="sm" 
            colorScheme="red" 
            mt={2} 
            onClick={() => deletePrompt(index)}
          >
            Delete
          </Button>
        </Box>
      ))}
    </VStack>
  );
}

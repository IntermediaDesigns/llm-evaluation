import { useGeneratedPrompts } from "../hooks/useGeneratedPrompts";
import { Button, Box, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  const { getLatestPrompt, deletePrompt } = useGeneratedPrompts();

  return (
    <div>
      {getLatestPrompt() && (
        <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
          <Text whiteSpace="pre-wrap">{getLatestPrompt()}</Text>
          <Button
            size="sm"
            colorScheme="red"
            mt={2}
            onClick={() => deletePrompt(prompt.length - 1)}
          >
            Delete
          </Button>
        </Box>
      )}
      <Button as={Link} ref="/history" mt={4}>
        View History
      </Button>
    </div>
  );
}

import { Box, Heading } from '@chakra-ui/react';
import { ScoreForm } from './ScoreForm';

export default function Home() {
  return (
    <Box maxW="sm" mx="auto" mt="10">
      <Heading as="h1" mb="6">Submit Your Happiness Score NOW</Heading>
      <ScoreForm />
    </Box>
  );
}

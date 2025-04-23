"use client";

import { Box, Button, Heading, HStack, useTheme } from "@chakra-ui/react";
import BackButton from "@/components/BackButton";
import { Celebration } from "@mui/icons-material";

interface RecognitionHeaderProps {
  headingText: string;
  onAddButtonClick?: () => void;
}

const RecognitionHeader: React.FC<RecognitionHeaderProps> = ({
  headingText,
  onAddButtonClick,
}) => {
  const theme = useTheme();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      w="full"
      my={2}
      width="100%"
    >
      <HStack>
        <BackButton />
        <Heading
          as="h1"
          fontWeight={100}
          color={theme.fringeCases.recognitionCard.secondaryTextColor}
          fontSize={{ base: "2xl", md: "4xl" }}
          fontFamily="Bonfire"
          textAlign="center"
          mt={2}
        >
          {headingText}
        </Heading>
      </HStack>
      <Box>
        <Button
          aria-label="Recognise Someone!"
          leftIcon={<Celebration />}
          onClick={onAddButtonClick}
          variant="primary"
        >
          Recognise Someone!
        </Button>
      </Box>
    </HStack>
  );
};

export default RecognitionHeader;

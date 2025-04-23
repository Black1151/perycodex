"use client";

import { Box, Heading, HStack, IconButton, useTheme } from "@chakra-ui/react";
import AddButton from "@/components/Buttons/AddButton";
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
    <HStack alignItems="center" justifyContent="space-between" w="full" my={2}>
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
        <AddButton
          label="Recognise Someone!"
          toolId={"0"}
          workflowId={"0"}
          redirectUrl={"/big-up"}
          onAddButtonClick={onAddButtonClick}
          AddIcon={Celebration}
          workflow={false}
        />
      </Box>
    </HStack>
  );
};

export default RecognitionHeader;

import React from "react";
import { Box, Button, Flex, Stack, useBreakpointValue } from "@chakra-ui/react";
import { NavigationProps } from "@/components/surveyjs/SurveyProps";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoneIcon from "@mui/icons-material/Done";

// Create a motion.div to animate the filling of the progress bar
const MotionButton = motion(Button);

const BottomNavigation: React.FC<NavigationProps> = ({
  currentPage,
  setCurrentPage,
  nextPage,
  prevPage,
  jumpToPage,
  submitSurvey,
  cancelSurvey,
  switchToDisplayMode,
  switchToEditMode,
  pageListOptions,
  isFirstPage,
  isLastPage,
  isEditing,
  isSubmitting,
}) => {
  // Responsive value for the button text; hides text on mobile
  const buttonText = useBreakpointValue({ base: "", md: "Previous" });
  const nextButtonText = useBreakpointValue({ base: "", md: "Next" });
  const submitButtonText = useBreakpointValue({ base: "", md: "Submit" });

  return (
    <Box px={["24px", "24px", "40px"]} py={"1em"} borderRadius="lg" w="100%">
      <Flex
        justify={pageListOptions.length <= 1 ? "flex-end" : "space-between"}
        align="center"
        w="100%"
      >
        {/* Left section: Previous and Next buttons */}
        {pageListOptions.length > 1 && (
          <Stack direction="row" spacing={4}>
            <MotionButton
              fontSize={"sm"}
              onClick={prevPage}
              disabled={isFirstPage}
              bgColor="darkGray"
              w="full"
              height={12}
              border="1px solid darkGray"
              color="white"
              _hover={{ color: "darkGray", backgroundColor: "white" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              display="flex"
              alignItems="center"
              gap={[0, 0, 2]}
              lineHeight={0}
            >
              <ArrowBackIcon />
              {buttonText}
            </MotionButton>

            <MotionButton
              fontSize={"sm"}
              onClick={nextPage}
              disabled={isLastPage}
              bgColor="darkGray"
              w="full"
              height={12}
              border="1px solid darkGray"
              color="white"
              _hover={{ color: "darkGray", backgroundColor: "white" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowForwardIcon />
              {nextButtonText}
            </MotionButton>
          </Stack>
        )}

        {/* Right section: Submit button */}
        <Stack direction="row" spacing={4}>
          {isEditing && (
            <MotionButton
              fontSize={"sm"}
              onClick={submitSurvey}
              bgColor="green"
              w="full"
              height={12}
              border="1px solid lightGray"
              color="white"
              _hover={{ color: "green", backgroundColor: "white" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DoneIcon />
              {submitButtonText}
            </MotionButton>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default BottomNavigation;

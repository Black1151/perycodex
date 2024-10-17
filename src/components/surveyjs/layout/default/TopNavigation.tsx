import React, {useEffect} from 'react';
import {Flex, Box, Text, Stack, Button, Icon, Switch, Divider, Center} from "@chakra-ui/react";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import {NavigationProps} from "@/components/surveyjs/SurveyProps";
import useModal from "@/components/surveyjs/useModal";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import ScrollablePageList from "@/components/surveyjs/layout/default/ScrollablePageList";
import CustomToggle from "@/components/surveyjs/layout/default/CustomToggle";

const animationDuration = 0.05; // Define the duration of the animation in seconds

const TopNavigation: React.FC<NavigationProps> = ({
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
                                                  }) => {
    const {isOpen, openModal, closeModal} = useModal(); // Use the hook
    const previousPageNo = React.useRef(currentPage);

    const handleCancelEdit = () => {
        cancelSurvey();
        closeModal();
    };

    const handleToggle = () => {
        if (isEditing) {
            openModal(); // Open the modal to confirm canceling edit mode
        } else {
            switchToEditMode(); // Switch to edit mode
        }
    };

    useEffect(() => {
        previousPageNo.current = currentPage; // Update the previous page number after render
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(currentPage);
    }, [currentPage]);

    return (
        <Box bg="white" p={4} borderRadius="lg" w="100%">
            <Stack spacing={4}>
                <Flex justifyContent="space-between" alignItems="center" flex={'1 1 auto'}>


                    {/* Scrollable Page List */}
                    <ScrollablePageList
                        pageListOptions={pageListOptions}
                        currentPage={currentPage}
                        jumpToPage={jumpToPage}
                        animationDuration={animationDuration}
                        previousPageNo={previousPageNo}
                    />

                    <CustomToggle iconA={VisibilityIcon} iconB={EditIcon} isChecked={isEditing}
                                  onToggle={handleToggle}/>

                </Flex>
            </Stack>
            <SurveyModal
                isOpen={isOpen}
                onClose={closeModal}
                onConfirm={handleCancelEdit}
                title="Confirm Edit Cancellation"
                bodyContent="Are you sure you want to cancel editing? Any unsaved changes will be lost."
                confirmLabel="Cancel"
                cancelLabel="Go Back"
            />
        </Box>
    );
};

export default TopNavigation;

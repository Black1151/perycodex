import React, {useEffect} from 'react';
import {Box, Flex} from "@chakra-ui/react";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import {NavigationProps} from "@/components/surveyjs/SurveyProps";
import useModal from "@/components/surveyjs/useModal";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
                                                      canEdit,
                                                      switchToDisplayMode,
                                                      switchToEditMode,
                                                      pageListOptions,
                                                      isFirstPage,
                                                      isLastPage,
                                                      isEditing,
                                                      isSubmitting
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
        <Box w="100%">
            {/* Custom Toggle Tab Container */}
            <Box
                borderRadius="lg"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                position="relative"
                zIndex={1}
            >
                <Box
                    bg="white"
                    py={2}
                    px={4}
                    borderBottomLeftRadius={'none'}
                    borderBottomRightRadius={'none'}
                    borderTopLeftRadius={'lg'}
                    borderTopRightRadius={'lg'}
                >


                    {/* Custom Toggle in its own box above the ScrollablePageList */}
                    <CustomToggle
                        iconA={VisibilityIcon}
                        iconB={EditIcon}
                        isChecked={isEditing}
                        canEdit={canEdit}
                        onToggle={handleToggle}
                    />
                </Box>
            </Box>
            <Box bg="white" py={4} px={2}
                 borderBottomLeftRadius={'none'}
                 borderBottomRightRadius={'none'}
                 borderTopLeftRadius={'lg'}
                 borderTopRightRadius={'none'}
                 w="100%">

                <Flex gap={2} flexWrap={'wrap'} align={'center'} justify={'flex-end'}>
                    <Box w={'100%'}>
                        <ScrollablePageList
                            pageListOptions={pageListOptions}
                            currentPage={currentPage}
                            jumpToPage={jumpToPage}
                            animationDuration={animationDuration}
                            previousPageNo={previousPageNo}
                        />
                    </Box>
                </Flex>
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
        </Box>
    );
};

export default TopNavigation;

import React from 'react';
import {Survey} from 'survey-react-ui';
import {Flex} from "@chakra-ui/react";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import {HappinessLayoutProps} from "@/components/surveyjs/SurveyProps";
import {LetterFlyIn} from "@/components/animations/text/LetterFlyIn";


const HappinessLayout: React.FC<HappinessLayoutProps> = ({
                                                             model,
                                                             dataset,
                                                             canEdit,
                                                             showTitle = false
                                                         }) => {
    const {
        currentPage,
        setCurrentPage,
        nextPage,
        prevPage,
        jumpToPage,
        submitSurvey,
        switchToDisplayMode,
        switchToEditMode,
        pageListOptions,
        isFirstPage,
        isLastPage,
        isEditing,
    } = useSurveyNavigation(model, dataset);

    return (
        <Flex w="full" justify="center" align="center" pt={'60px'} bg={'perygonPink'} position="fixed"
              direction="column" top={0} left={0}
              height={'100svh'} width={'100svw'} zIndex={101}>
            {showTitle && (<LetterFlyIn>What is your happiness score this week?</LetterFlyIn>)}
            <Survey model={model}/>
        </Flex>
    );
};

export default HappinessLayout;

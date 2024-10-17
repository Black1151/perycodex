import React from 'react';
import {Survey} from 'survey-react-ui';
import {Flex} from "@chakra-ui/react";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import {LayoutProps} from "@/components/surveyjs/SurveyProps";


const HappinessLayout: React.FC<LayoutProps> = ({model, dataset}) => {
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
        <Flex w="full" justify="center" align="center" pt={'60px'} position="fixed" direction="column" top={0} left={0}
              height={'100svh'} width={'100svw'}>
            <Survey model={model}/>
        </Flex>
    );
};

export default HappinessLayout;

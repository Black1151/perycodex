import React from "react";
import {Survey} from "survey-react-ui";
import {Flex, Text, Box} from "@chakra-ui/react";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import {eNPSLayoutProps} from "@/types/surveyJs";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";
import {useUser} from "@/providers/UserProvider";
import {LetterFlyIn} from "@/components/animations/text/LetterFlyIn";

const ClientSatisfactionLayout: React.FC<eNPSLayoutProps> = ({model, dataset, canEdit}) => {
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

    const {user} = useUser();

    return (
        <SurveyNavigationGuard
            isEditing={isEditing}
            setToDisplayMode={switchToDisplayMode}
            setToEditMode={switchToEditMode}
        >
            <Flex
                direction="column"
                justify={"center"}
                align={"center"}
                height={"full"}
                gap={2}
            >
                <Text
                    color={"white"}
                    fontFamily={"Bonfire"}
                    fontSize={'2xl'}
                    mt={4}
                    fontWeight={100}
                    textAlign={"center"}
                    mb={6}
                >
                    <LetterFlyIn>
                        Client Satisfaction
                    </LetterFlyIn>
                </Text>
                <Box bg={'white'} borderRadius={'lg'} w={'500px'}>
                    <Survey model={model}/>
                </Box>
            </Flex>
        </SurveyNavigationGuard>
    );
};

export default ClientSatisfactionLayout;

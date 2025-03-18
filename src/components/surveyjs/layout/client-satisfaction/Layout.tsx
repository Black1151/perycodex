import React from "react";
import {Survey} from "survey-react-ui";
import {Flex, Text, Box, Button} from "@chakra-ui/react";
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
                <Flex
                    direction="row"
                    justify={"center"}
                    align={"center"}
                    height={"full"}
                    w={'full'}
                    gap={2}>
                    <Box>
                        <Button onClick={prevPage}>Previous</Button>
                        <Button onClick={nextPage}>Next</Button>
                    </Box>
                    <Box bg={'white'} borderRadius={'lg'} w={'full'}>
                        <Survey model={model}/>
                    </Box>
                </Flex>
            </Flex>
        </SurveyNavigationGuard>
    );
};

export default ClientSatisfactionLayout;

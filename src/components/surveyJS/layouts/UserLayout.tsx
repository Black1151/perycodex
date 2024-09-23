import React from 'react';
import {Box, Container, Flex, Heading, IconButton, Progress, Text} from "@chakra-ui/react";
import {Survey} from "survey-react-ui";
import {LayoutProps} from "@/types/LayoutProps"
import {CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon} from "@chakra-ui/icons";
import useAppNavigation from "@/hooks/useAppNavigation";


const UserLayout: React.FC<LayoutProps> = ({
                                               survey,
                                               title,
                                               isEditing,
                                               isNew,
                                               setIsEditing,
                                               pageNo,
                                               setPageNo,
                                               prevPage,
                                               nextPage,
                                               submitForm,
                                               cancelForm,
                                               canEdit,
                                               handleToggleEdit,
                                               PageList,
                                               PageSelector,
                                               pageListOptions
                                           }) => {

    const totalPages = survey.visiblePageCount;
    const {handleBackClick} = useAppNavigation();

    return (
        <Flex
            justify="center"
            align="center"
            overflow="hidden"
            w="full"
            h="100vh"
            bg="rgba(229, 229, 229, 0.8)" // Adjusted RGBA for transparency and slight darkness
            position="fixed"
            top={0}
            left={0}
        >
            <Container
                maxW={"5xl"}
                w={['full', 'full', 'full', '80%']}
                border="0px solid black"
                p={0}
                borderRadius={12}
                bg="background_2"
                minH="65vh"
                h={['full', 'full', 'full', '95%']}
                overflow="auto"
                position="relative"
            >
                <Box
                    position="sticky"
                    top={0}
                    zIndex={10}
                    bg="background_2"
                    p={4}
                >
                    <Flex
                        direction="row"
                        justify="space-between"
                        align="center"
                        width="100%"
                        mb={4}
                        pb={4}
                        borderBottom={'1px solid green'}
                    >
                        <Box flex="1" mx={4}>
                            <Flex w={'full'}>

                                <Text opacity={0.8}>
                                    {pageListOptions[pageNo].name}
                                </Text>
                                <Text opacity={0.8} ml={'auto'}>
                                    {`${pageNo + 1} of ${survey.visiblePageCount}`}
                                </Text>
                            </Flex>
                            <Progress value={(pageNo + 1) / totalPages * 100} size="md" colorScheme="green"/>
                        </Box>

                        {/* Bottom Row: Navigation Buttons */}
                        <Flex align="center" justify="center" gap={6}>
                            {pageNo !== 0 &&
                                <IconButton
                                    variant="solid"
                                    onClick={prevPage}
                                    icon={<ChevronLeftIcon/>}
                                    aria-label="previous-page"
                                    colorScheme="teal"
                                    size="lg"
                                />
                            }
                            {pageNo !== totalPages - 1 &&
                                <IconButton
                                    variant="solid"
                                    onClick={nextPage}
                                    icon={<ChevronRightIcon/>}
                                    aria-label="next-page"
                                    colorScheme="teal"
                                    size="lg"
                                />
                            }
                            <IconButton
                                variant={"solid"}
                                colorScheme={"red"}
                                onClick={handleBackClick}
                                icon={<CloseIcon/>}
                                size={'lg'}
                                aria-label="save-form"
                            />
                            <IconButton
                                variant="solid"
                                colorScheme="green"
                                onClick={submitForm}
                                isDisabled={pageNo !== totalPages - 1}
                                icon={<CheckIcon/>}
                                aria-label="submit-form"
                                size="lg"
                            />
                        </Flex>
                    </Flex>
                </Box>
                <Flex direction="column" p={4}>
                    <Heading size="lg">{title || "Survey"}</Heading>
                    <Survey
                        model={survey}
                        currentPageNo={pageNo}
                    />
                </Flex>
            </Container>
        </Flex>
    );
};

export default UserLayout;

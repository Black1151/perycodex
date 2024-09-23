import React from 'react';
import {Box, Flex, Badge, Icon, Heading, IconButton} from "@chakra-ui/react";
import {Survey} from "survey-react-ui";
import {CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, EditIcon} from "@chakra-ui/icons";
import {LayoutProps} from "@/types/LayoutProps"

const AdminLayout: React.FC<LayoutProps> = ({
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


    return (
        <Box overflow="auto" w="full" bg="background_2" borderRadius="md" px={4}>
            {/* Top Navigation */}
            <Flex
                w="full"
                flexDir="row"
                mt={4}
                alignItems="center"
                pb={2}
                gap={2}
                borderBottom={"1px solid"}
                wrap="wrap"
                borderBottomColor="primary"
            >
                {title && <Heading size="lg">{title}</Heading>}
                <Flex ml={'auto'} align={'center'} gap={3} w={'full'}>
                    {isEditing && (
                        <Badge
                            colorScheme="green"
                            variant="solid"
                            fontSize="0.9em"
                            px={3}
                            py={1}
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            ml={2} // Margin to the left for spacing if necessary
                        >
                            <Icon as={EditIcon} mr={1} boxSize="1em"/>
                            Editing
                        </Badge>
                    )}

                    {PageSelector}
                    {pageNo !== 0 &&
                        < IconButton
                            variant={"solid"}
                            onClick={prevPage}
                            icon={<ChevronLeftIcon/>}
                            aria-label="previous-page"
                            display={['none', 'none', 'block']}
                        />
                    }
                    {pageNo !== survey.visiblePageCount - 1 &&
                        <IconButton
                            variant={"solid"}
                            onClick={nextPage}
                            icon={<ChevronRightIcon/>}
                            aria-label="next-page"
                            display={['none', 'none', 'block']}
                        />
                    }
                    {canEdit && !isNew && !isEditing && (
                        <IconButton
                            variant={"solid"}
                            colorScheme={"teal"}
                            onClick={handleToggleEdit}
                            icon={<EditIcon/>}
                            aria-label="edit-form"
                        />
                    )}
                    {canEdit && isEditing && !isNew && (
                        <IconButton
                            variant={"solid"}
                            colorScheme={"red"}
                            onClick={cancelForm}
                            icon={<CloseIcon/>}
                            aria-label="save-form"
                        />
                    )}
                    {canEdit && isEditing && (
                        <IconButton
                            variant={"solid"}
                            colorScheme={"teal"}
                            onClick={submitForm}
                            icon={<CheckIcon/>}
                            aria-label="save-form"
                        />
                    )}
                </Flex>
            </Flex>
            <Flex height="100%" gap={2}>
                <Box borderRight="1px solid" borderRightColor="primary" p={2}
                     display={['none', 'none', 'none', 'block']} overflow={''}>
                    <Flex ml={'auto'} align={'center'} gap={4} direction={'column'}>
                        <Flex align={'center'} justify={'space-between'} gap={2} w={'full'}>
                            {pageNo !== 0 &&
                                < IconButton
                                    mr={'auto'}
                                    variant={"solid"}
                                    onClick={prevPage}
                                    icon={<ChevronLeftIcon/>}
                                    aria-label="previous-page"
                                />
                            }
                            {pageNo !== survey.visiblePageCount - 1 &&
                                <IconButton
                                    ml={'auto'}
                                    variant={"solid"}
                                    onClick={nextPage}
                                    icon={<ChevronRightIcon/>}
                                    aria-label="next-page"
                                />
                            }

                        </Flex>
                        {PageList}
                    </Flex>
                </Box>
                <Survey
                    model={survey}
                    currentPageNo={pageNo}
                />
            </Flex>
        </Box>
    );
};

export default AdminLayout;

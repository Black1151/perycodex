"use client";

import React from "react";
import {Box, Grid, Avatar, Text, Flex} from "@chakra-ui/react";
import {
    AnimatedList,
    AnimatedListItem,
} from "@/components/animations/AnimatedList";
import {BigUpWallEntry} from "../../types";

interface RecognitionListProps {
    items: BigUpWallEntry[];
    reverseRecognition?: boolean;
}

const getPersonDetails = (item: BigUpWallEntry, reverseRecognition: boolean) => {
    if (reverseRecognition) {
        return {
            fullName: item.userNameFrom,
            userImageUrl: item.userImageUrlFrom,
            recognizedBy: item.userNameTo,
        };
    } else {
        return {
            fullName: item.userNameTo,
            userImageUrl: item.userImageUrlTo,
            recognizedBy: item.userNameFrom,
        };
    }
};


export const RecognitionList: React.FC<RecognitionListProps> = ({items, reverseRecognition = false}) => {

    return (
        <Grid
            templateColumns={["1fr", null, "1fr 1fr", null, null, "1fr 1fr"]}
            gap={6}
        >
            <AnimatedList>
                {items &&
                    items.map((item, index) => {
                        const personDetails = getPersonDetails(item, reverseRecognition);

                        return (
                            <AnimatedListItem key={item.userIdUrlTo} index={index}>
                                <Box
                                    bg="perygonBlueTransparent"
                                    boxShadow="0 0 10px 2px rgba(192, 192, 192, 0.8)"
                                    p={4}
                                    rounded="md"
                                >
                                    <Flex alignItems="center" justify="space-between">
                                        <Flex flexDirection="column" flex="1">
                                            <Text fontSize="xl" color="perygonPink" fontWeight="bold">
                                                {personDetails.fullName}
                                            </Text>
                                            <Text fontSize="xs" color="white">
                                                {reverseRecognition ? 'recognised me' : `recognised by ${personDetails.recognizedBy}`}
                                            </Text>
                                            <Text fontSize="xs" color="pink.300" pt={1}>
                                                {item.createdAt.split(" ")[0]}
                                            </Text>
                                            <Text
                                                mt={1}
                                                fontSize="lg"
                                                color="perygonPink"
                                                fontWeight="bold"
                                            >
                                                {item.bigUpCategory}
                                            </Text>
                                        </Flex>
                                        <Avatar
                                            size="lg"
                                            name={personDetails.fullName}
                                            src={personDetails.userImageUrl}
                                        />
                                    </Flex>
                                    <Box mt={4} minHeight={30}>
                                        <Text fontSize="sm" color="white">
                                            {item.bigUpMessage}
                                        </Text>
                                    </Box>
                                </Box>
                            </AnimatedListItem>
                        );
                    })}
            </AnimatedList>
        </Grid>
    )
        ;
};

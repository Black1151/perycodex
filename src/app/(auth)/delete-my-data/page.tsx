import React from 'react';
import {PerygonContainer} from "@/components/layout/PerygonContainer";
import {Text, Flex, Heading} from "@chakra-ui/react"

const Page = () => {
    return (
        <PerygonContainer>
            <Flex minHeight="100svh" flexDirection={'column'} gap={6} justify={'center'} align={'center'}>
                <Heading fontFamily={'bonfire'} color={'white'} fontSize={'48px'} fontWeight={'400'}>Perygon</Heading>
                <a href={"mailto:delete-my-data@perygon.co.uk"}><Text color={'white'}>Request to delete my
                    data</Text></a>
            </Flex>
        </PerygonContainer>
    );
};

export default Page;
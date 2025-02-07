import React from 'react';
import {Flex, Link} from "@chakra-ui/react";

const PublicFooter = () => {
    return (
        <Flex justify={'space-between'} align={'center'} w={["95%", "90%", "85%"]}>
            <Link href={"https://sedulo.co.uk/"} color="white"
                  _hover={{textDecoration: 'underline', cursor: 'pointer'}} isExternal>
                Sedulo Limited
            </Link>
            <Link href={'/privacy-policy'}
                  color="white"
                  _hover={{textDecoration: 'underline', cursor: 'pointer'}}>
                Privacy Policy
            </Link>
        </Flex>
    );
};

export default PublicFooter;
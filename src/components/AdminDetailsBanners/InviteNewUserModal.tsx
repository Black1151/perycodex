import { Box, Heading, Button } from '@chakra-ui/react';

const InviteNewUserModal = () => {
    return (
        <Box p={8} textAlign="center">
            <Heading>Create a New User</Heading>
            <Button mt={4} colorScheme="blue">Submit</Button>
        </Box>
    );
};

export default InviteNewUserModal;

import React from 'react';
import {PerygonContainer} from "@/components/layout/PerygonContainer";
import {Text, Flex, Heading, Button, Link} from "@chakra-ui/react";

const Page = () => {
    return (
        <PerygonContainer>
            <Flex minHeight="100svh" flexDirection={'column'} gap={6} justify={'center'} align={'center'} py={2}
                  w={'full'}>
                <Heading fontFamily={'bonfire'} color={'white'} fontSize={'48px'} fontWeight={'400'}>
                    Perygon
                </Heading>
                <Flex flexDirection={'column'} w={["90%", "85%", '75%']} bg={"white"} justify={"center"}
                      borderRadius={"2xl"} p={4} shadow={"xl"} gap={2}>
                    <Text color={'black'} fontSize={'20px'} fontWeight={'600'}>
                        At Perygon, we take your privacy seriously. If you wish to delete your account and all
                        associated
                        data, please follow the steps below:
                    </Text>
                    <Text color={'black'} fontSize={'16px'} mt={4}>
                        <strong>1. Request Deletion:</strong> Click the link below to send an email to our support team
                        requesting the deletion of your account and all personal data.
                    </Text>
                    <Text color={'black'} fontSize={'16px'} mt={2}>
                        <strong>2. Types of Data Deleted:</strong> Upon account deletion, all personal data including
                        your
                        account information, user history, and any other identifiable information will be permanently
                        deleted from our systems that does not affect the analytics of your employer.
                    </Text>
                    <Text color={'black'} fontSize={'16px'} mt={2}>
                        <strong>3. Data Retention Period:</strong> Any data required by law or for operational purposes
                        (e.g., transactions or legal records) will be kept for a limited period and then securely
                        deleted.
                    </Text>
                    <Text color={'black'} fontSize={'16px'} mt={2}>
                        <strong>4. Confirmation:</strong> You will receive a confirmation email once your request is
                        processed. Please allow up to 21 business days for the deletion process to be completed.
                    </Text>
                    <Heading mt={6} color={'black'} fontSize={'24px'} fontWeight={'600'}>What to put in your
                        email?</Heading>
                    <Text>
                        1. In the subject of your email please enter the following: <strong>First
                        Name</strong>, <strong>Last
                        Name</strong>, and the <strong>Company Name</strong> you are associated with.
                    </Text>
                    <Text>
                        2. In the body of your email please explain the reasons for your request.
                    </Text>
                    <a href={"mailto:delete-my-data@perygon.co.uk"} style={{textAlign: "center", maxWidth: "100%"}}>
                        <Button color={'white'} bg={"red"} fontSize={['12px', '18px']} mt={6}>Click here to request to
                            delete your
                            data</Button>
                    </a>
                </Flex>


                <Flex justify={'space-between'} align={'center'} w={["90%", "85%", '75%']}>
                    <Link href={"https://sedulo.co.uk/"} color="white"
                          _hover={{textDecoration: 'underline', cursor: 'pointer'}} isExternal>
                        Sedulo Limited
                    </Link>
                    <Link href={"https://sedulo.co.uk/wp-content/uploads/2024/07/Sedulo-Privacy-Notice.pdf"}
                          color="white"
                          _hover={{textDecoration: 'underline', cursor: 'pointer'}}
                          isExternal>
                        Privacy Policy
                    </Link>
                </Flex>
            </Flex>
        </PerygonContainer>
    );
};

export default Page;

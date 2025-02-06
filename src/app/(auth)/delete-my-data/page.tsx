import React from 'react';
import {Text, Flex, Heading, Button, Link, Menu, MenuButton, MenuList, MenuItem} from "@chakra-ui/react";
import PublicLayout from "@/components/public/PublicLayout";

const Page = () => {
    return (
        <PublicLayout>
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
            <a href={"mailto:delete-my-data@perygon.co.uk"}
               style={{textAlign: "end", maxWidth: "100%", marginTop: 'auto'}}>
                <Button
                    color="white"
                    bg="red"
                    fontSize={["12px", "18px"]}
                    mt={6}
                    _hover={{
                        bg: "perygonPink",
                    }}
                    _active={{
                        bg: "white",
                        color: "perygonPink",
                    }}
                >
                    Click here to request to delete your data
                </Button>
            </a>
        </PublicLayout>
    );
};

export default Page;

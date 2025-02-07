import React from "react";
import {
    Container,
    Heading,
    Text,
    UnorderedList,
    ListItem,
    Box,
    Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import PublicLayout from "@/components/public/PublicLayout";
import {LetterFlyIn} from "@/components/animations/text/LetterFlyIn";

export default function PrivacyPolicyPage() {
    return (
        <PublicLayout>
            <Container maxW="container.lg" py={8}>
                {/* MAIN LAYOUT: Two Columns */}
                <Stack
                    direction={["column", "row"]}
                    spacing={8}
                    align="flex-start"
                >
                    {/* LEFT COLUMN: Policy Text */}
                    <Box flex="1">
                        {/* Heading / Dates */}
                        <Heading as="h1" size="2xl" mb={4}>
                            Privacy Policy
                        </Heading>

                        <Text fontWeight="bold">
                            Effective Date: 01/02/2025
                        </Text>
                        <Text fontWeight="bold" mb={4}>
                            Last Updated: 07/02/2025
                        </Text>

                        <Text mb={4}>
                            <Text as={'span'} fontFamily={'bonfire'} fontSize={'32px'} fontWeight={200}
                                  color={'perygonPink'}>Perygon</Text> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
                            respects your
                            privacy
                            and is committed to protecting your personal information. This Privacy
                            Policy explains how we collect, use, disclose, and safeguard your
                            information when you use our application (&quot;App&quot;).
                        </Text>

                        <Text mb={4}>
                            By using the App, you agree to the terms outlined in this Privacy Policy.
                        </Text>

                        <Heading as="h2" size="lg" mt={6} mb={2}>
                            GDPR
                        </Heading>

                        <Text mb={2}>
                            The General Data Protection Regulation (GDPR) became effective on 25th May 2018, and all
                            organisations
                            that process personal data must ensure to be compliant with the regulations and principles.
                        </Text>

                        <Text>
                            We must make sure that:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>We are lawful, fair and transparent in the way that data is processed.</ListItem>
                            <ListItem>Personal data is used for a specific purpose.</ListItem>
                            <ListItem>We only record the data that is required.</ListItem>
                            <ListItem>Have a duty to keep the data accurate.</ListItem>
                            <ListItem>Data is only kept for as long as is required.</ListItem>
                            <ListItem>All data is stored securely.</ListItem>
                        </UnorderedList>
                        <Text mb={2}>
                            This Privacy Notice will detail how we comply with the above principles as well as your
                            rights as the data owner.
                        </Text>
                        {/* 1. Information We Collect */}
                        <Heading as="h2" size="lg" mt={6} mb={2}>
                            1. Information We Collect
                        </Heading>
                        <Text mb={2}>
                            When you use our App, we may collect the following types of data:
                        </Text>

                        <Text fontWeight="bold" mb={2}>
                            a) Personal Information
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>
                                <strong>Email and Password Login Data</strong>
                            </ListItem>
                            <ListItem>
                                <strong>SSO Login Data:</strong> If you log in using Google or Microsoft
                                SSO, we receive your email address, name, and profile picture (depending on
                                your provider’s permissions).
                            </ListItem>
                            <ListItem>
                                <strong>User-Generated Content:</strong> Any content you voluntarily
                                provide within the App.
                            </ListItem>
                            <ListItem>
                                <strong>Contact Information:</strong> If you provide it for support
                                or account purposes.
                            </ListItem>
                        </UnorderedList>

                        <Text fontWeight="bold" mb={2}>
                            b) Non-Personal Information
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>
                                <strong>Device Information:</strong> Model, OS version, unique device
                                identifiers.
                            </ListItem>
                            <ListItem>
                                <strong>Usage Data:</strong> Interactions with the App, pages viewed,
                                and time spent.
                            </ListItem>
                            <ListItem>
                                <strong>Analytics:</strong> To improve performance and user experience.
                            </ListItem>
                        </UnorderedList>

                        {/* 2. How We Use Your Information */}
                        <Heading as="h2" size="lg" mt={6} mb={2}>
                            2. How We Use Your Information
                        </Heading>
                        <Text mb={4}>
                            We use your information for the following purposes:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>
                                To authenticate users and provide access through email and password.
                            </ListItem>
                            <ListItem>
                                To authenticate users and provide access through SSO (Google/Microsoft).
                            </ListItem>
                            <ListItem>To personalize your experience within the App.</ListItem>
                            <ListItem>To improve and optimize our services.</ListItem>
                            <ListItem>To communicate important updates or support messages.</ListItem>
                            <ListItem>To comply with legal obligations.</ListItem>
                        </UnorderedList>

                        {/* 3. How We Share Your Information */}
                        <Heading as="h2" size="lg" mt={6} mb={2}>
                            3. How We Share Your Information
                        </Heading>
                        <Text mb={4}>
                            We do not sell your personal data. However, we may share information with:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>
                                Third-Party Services (Google, Microsoft) to facilitate SSO login.
                            </ListItem>
                            <ListItem>
                                Service Providers who assist in hosting, analytics, or app functionality.
                            </ListItem>
                            <ListItem>
                                Legal Authorities if required by law.
                            </ListItem>
                        </UnorderedList>

                        {/* 4. Data Security */}
                        <Heading as="h2" size="lg" mt={6} mb={2}>
                            4. Data Security
                        </Heading>
                        <Text mb={4}>
                            We take appropriate measures to protect your data from unauthorized access,
                            alteration, or misuse. However, no method of transmission over the internet
                            is 100% secure.
                        </Text>

                        {/* 5. Your Rights & Choices */}
                        <Heading as="h2" size="lg" mt={6} mb={2}>
                            5. Your Rights & Choices
                        </Heading>
                        <Text mb={2}>
                            You have the right to:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>Access or update your personal information.</ListItem>
                            <ListItem>Request deletion of your account and data.
                                <Text as={"span"} color={"perygonPink"}>
                                    <Link href={'/delete-my-data'}>
                                        {" "}Click here
                                    </Link>
                                </Text></ListItem>
                            <ListItem>Opt-out of certain data collection (e.g., analytics).</ListItem>
                        </UnorderedList>
                        <Text mb={4}>
                            To exercise these rights, contact us at supportteam@perygon.co.uk.
                        </Text>

                        {/* 6. Third-Party Links & Services */}
                        <Heading as="h2" size="lg" mt={6} mb={2}>
                            6. Third-Party Links & Services
                        </Heading>
                        <Text mb={4}>
                            Our App may contain links to third-party websites or services. We are not
                            responsible for their privacy practices. Please review their policies
                            separately.
                        </Text>

                        {/* 7. Children's Privacy */}
                        <Heading as="h2" size="lg" mt={6} mb={2}>
                            7. Children&apos;s Privacy
                        </Heading>
                        <Text mb={4}>
                            Our App is not intended for children under 13. We do not knowingly collect
                            data from minors.
                        </Text>

                        {/* 8. Changes to This Policy */}
                        <Heading as="h2" size="lg" mt={6} mb={2}>
                            8. Changes to This Policy
                        </Heading>
                        <Text mb={4}>
                            We may update this Privacy Policy. Any changes will be posted with an updated
                            &quot;Last Updated&quot; date.
                        </Text>

                        {/* 9. Contact Us */}
                        <Heading as="h2" size="lg" mt={6} mb={2}>
                            9. Contact Us
                        </Heading>
                        <Text mb={4}>
                            If you have any questions, contact us at:
                            <br/>
                            Email: supportteam@perygon.co.uk
                        </Text>
                    </Box>

                    {/* RIGHT COLUMN: Sticky or Branding (Optional) */}
                    <Box
                        flex="1"
                        textAlign="center"
                        position="sticky"
                        top="1rem"
                        display={["none", "none", "none", "block"]}
                    >
                        <LetterFlyIn
                            as="span"
                            fontSize="102px"
                            fontWeight={200}
                            color="perygonPink"
                        >
                            Your Data
                        </LetterFlyIn>
                    </Box>
                </Stack>
            </Container>
        </PublicLayout>
    );
}

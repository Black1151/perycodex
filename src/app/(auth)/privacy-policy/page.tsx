import {Box, Heading, Text, UnorderedList, ListItem, Link} from "@chakra-ui/react";
import {PerygonContainer} from "@/components/layout/PerygonContainer";


export default function PrivacyPolicy() {
    return (
        <PerygonContainer>
            <Box p={8} maxW="800px" mx="auto">
                <Heading as="h1" size="xl" mb={4}>Privacy Policy</Heading>
                <Text fontWeight="bold">Effective Date: [Insert Date]</Text>
                <Text mb={4}>This Privacy Policy explains how we collect, use, and protect your personal data in
                    compliance
                    with GDPR.</Text>

                <Heading as="h2" size="lg" mt={6}>Who We Are</Heading>
                <Text>We are Sedulo, a financial services company providing accountancy, tax advisory, payroll, funding,
                    and
                    wealth management services across the UK.</Text>

                <Heading as="h2" size="lg" mt={6}>What Data We Collect</Heading>
                <Text>We may collect personal data such as:</Text>
                <UnorderedList>
                    <ListItem>Full Name</ListItem>
                    <ListItem>Email Address</ListItem>
                    <ListItem>Phone Number</ListItem>
                    <ListItem>Bank Account Details</ListItem>
                    <ListItem>Employment Information</ListItem>
                    <ListItem>National Insurance Number</ListItem>
                    <ListItem>Other relevant business and financial data</ListItem>
                </UnorderedList>

                <Heading as="h2" size="lg" mt={6}>How We Collect Your Data</Heading>
                <Text>We collect data through direct interactions, phone calls, emails, and third-party service
                    providers
                    that comply with GDPR.</Text>

                <Heading as="h2" size="lg" mt={6}>How We Use Your Data</Heading>
                <Text>Your data is used to:</Text>
                <UnorderedList>
                    <ListItem>Provide financial services</ListItem>
                    <ListItem>Process payments</ListItem>
                    <ListItem>Maintain business relationships</ListItem>
                    <ListItem>Ensure compliance with legal obligations</ListItem>
                    <ListItem>Send marketing communications (with consent)</ListItem>
                </UnorderedList>

                <Heading as="h2" size="lg" mt={6}>Who We Share Your Data With</Heading>
                <Text>We may share your data with:</Text>
                <UnorderedList>
                    <ListItem>Regulatory bodies (e.g., HMRC)</ListItem>
                    <ListItem>Financial service providers</ListItem>
                    <ListItem>IT and cloud storage providers</ListItem>
                    <ListItem>Legal and audit professionals</ListItem>
                </UnorderedList>

                <Heading as="h2" size="lg" mt={6}>How We Protect Your Data</Heading>
                <Text>We implement strict security measures to prevent unauthorized access, disclosure, or loss of your
                    data.</Text>

                <Heading as="h2" size="lg" mt={6}>Your Rights</Heading>
                <Text>Under GDPR, you have the right to:</Text>
                <UnorderedList>
                    <ListItem>Access your data</ListItem>
                    <ListItem>Request data correction or deletion</ListItem>
                    <ListItem>Restrict processing</ListItem>
                    <ListItem>Object to data processing</ListItem>
                    <ListItem>Withdraw consent at any time</ListItem>
                </UnorderedList>

                <Heading as="h2" size="lg" mt={6}>Contact Us</Heading>
                <Text>If you have any concerns about your data, contact us:</Text>
                <Text><strong>Email:</strong> <Link href="mailto:gdpr@sedulo.co.uk"
                                                    color="blue.500">gdpr@sedulo.co.uk</Link></Text>
                <Text><strong>Phone:</strong> 0333 222 4445</Text>
                <Text><strong>Address:</strong> 62-66 Deansgate, Manchester, M3 2EN</Text>
            </Box>
        </PerygonContainer>
    );
}

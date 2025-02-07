import React from "react";
import {
    Container,
    Heading,
    Text,
    UnorderedList,
    ListItem,
    Box,
    Stack,
    Table,
    Tbody,
    Tr,
    Td
} from "@chakra-ui/react";
import PublicLayout from "@/components/public/PublicLayout";
import {LetterFlyIn} from "@/components/animations/text/LetterFlyIn";

export default function PrivacyPolicyPage() {
    return (
        <PublicLayout>
            <Container maxW="container.xl" py={8}>
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
                            Privacy Notice
                        </Heading>

                        <Text fontWeight="bold">
                            Effective Date: 01/02/2025
                        </Text>
                        <Text fontWeight="bold" mb={4}>
                            Last Updated: 07/02/2025
                        </Text>

                        <Text mb={4}>
                            <strong>Perygon</strong> (&quot;Sedulo&quot;, &quot;we&quot;, &quot;us&quot;,
                            or &quot;our&quot;) respects your
                            privacy and is
                            committed to protecting your personal information. This Privacy Policy explains how we
                            collect, use, disclose, and safeguard your information.
                        </Text>

                        <Text mb={4}>
                            The General Data Protection Regulation (GDPR) became effective on 25th May 2018, and all
                            organisations that process personal data must ensure they are compliant with the regulations
                            and principles.
                        </Text>

                        <Text mb={2}>
                            We must make sure that:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>We are lawful, fair and transparent in the way that data is processed.</ListItem>
                            <ListItem>Personal data is used for a specific purpose.</ListItem>
                            <ListItem>We only record the data that is required.</ListItem>
                            <ListItem>We have a duty to keep the data accurate.</ListItem>
                            <ListItem>Data is only kept for as long as is required.</ListItem>
                            <ListItem>All data is stored securely.</ListItem>
                        </UnorderedList>

                        <Text mb={4}>
                            This Privacy Notice will detail how we comply with the above principles as well as
                            your rights as the data owner.
                        </Text>

                        {/* WHO ARE WE? */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            1. WHO ARE WE?
                        </Heading>
                        <Text mb={2}>
                            Sedulo is a Financial Services Company based in the North of England and London. We
                            specialise
                            in providing Accountancy and Tax Advisory services along with Payroll, Funding and Wealth
                            Management. Our company names are{" "}
                            &quot;Sedulo Accountants Ltd&quot;, &quot;Sedulo Funding Solutions Ltd&quot;, &quot;Sedulo
                            Leeds Ltd&quot;,
                            &quot;Sedulo Wealth Management Ltd&quot;, &quot;Sedulo Audit Ltd&quot;, &quot;Sedulo
                            Liverpool Ltd&quot;,
                            &quot;Sedulo London Ltd&quot;, &quot;Sedulo CF Ltd&quot;, &quot;Sedulo Consultancy
                            Ltd&quot;,
                            &quot;Sedulo Investments LLP&quot;, &quot;Sedulo Group Ltd&quot;, &quot;Sedulo IT Ltd&quot;,
                            &quot;Sedulo Foundation&quot;, &quot;Magna Money Ltd&quot;, &quot;Sedulo Transaction
                            Services Ltd&quot;,
                            &quot;Sedulo Birmingham Limited&quot;, &quot;Sedulo Bico Limited&quot;, &quot;Be The
                            Standard Limited&quot;.
                        </Text>

                        <Text fontWeight="bold" mb={2}>
                            Apps:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>
                                <strong>Perygon</strong> is developed and operated by Sedulo Accountants Limited, part
                                of the
                                above group.
                            </ListItem>
                            <ListItem>
                                <strong>Nexus</strong> is developed and operated by Sedulo Accountants Limited, part of
                                the
                                above group.
                            </ListItem>
                        </UnorderedList>

                        {/* WHAT DATA DO WE COLLECT */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            2. WHAT DATA DO WE COLLECT?
                        </Heading>
                        <Text mb={4}>
                            Personal data refers to any data that can be used to identify a natural person, and we only
                            process personal information that is required for us to carry out our business dealings for
                            the customer.
                        </Text>

                        <Text mb={2} fontWeight="bold">
                            For Clients
                        </Text>
                        <Text mb={4}>
                            Depending on your relationship with us and the services we are providing, we may collect
                            a combination of the information detailed below (please note this list is not exhaustive):
                        </Text>
                        <UnorderedList>
                            <Table style={{fontSize: "sm"}}>
                                <Tbody>
                                    <Tr>
                                        <Td p={2}><ListItem>Company address</ListItem></Td>
                                        <Td p={2}><ListItem>Personal address</ListItem></Td>
                                        <Td p={2}><ListItem>NI number</ListItem></Td>
                                    </Tr>
                                    <Tr>
                                        <Td p={2}><ListItem>Date of birth</ListItem></Td>
                                        <Td p={2}><ListItem>Bank account information</ListItem></Td>
                                        <Td p={2}><ListItem>Personal/sales invoices</ListItem></Td>
                                    </Tr>
                                    <Tr>
                                        <Td p={2}><ListItem>Copies of ID</ListItem></Td>
                                        <Td p={2}><ListItem>Contact number</ListItem></Td>
                                        <Td p={2}><ListItem>Website</ListItem></Td>
                                    </Tr>
                                    <Tr>
                                        <Td p={2}><ListItem>Email address</ListItem></Td>
                                        <Td p={2}><ListItem>Job titles</ListItem></Td>
                                        <Td p={2}><ListItem>Salary details</ListItem></Td>
                                    </Tr>
                                    <Tr>
                                        <Td p={2}><ListItem>Student loan information</ListItem></Td>
                                        <Td p={2}><ListItem>Gender</ListItem></Td>
                                        <Td p={2}><ListItem>Marital status</ListItem></Td>
                                    </Tr>
                                    <Tr>
                                        <Td p={2}><ListItem>Nationality</ListItem></Td>
                                        <Td p={2}><ListItem>Criminal record information</ListItem></Td>
                                        <Td p={2}><ListItem>Personal Assets and liabilities</ListItem></Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </UnorderedList>

                        <Text mt={6} mb={2} fontWeight="bold">
                            For App users
                        </Text>
                        <Text mb={2}>
                            When you use our Apps, we may collect the following types of information:
                        </Text>

                        <Text mb={2} fontWeight="bold">a) Personal Information</Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>
                                <strong>SSO Login Data</strong> – If you sign in using Google or Microsoft SSO, we may
                                receive
                                your email address, name, and profile picture (subject to provider permissions).
                            </ListItem>
                            <ListItem><strong>Email and password </strong> login for the application.</ListItem>
                            <ListItem>
                                <strong>Account Details</strong> – Information you provide when setting up or managing
                                your
                                profile.
                            </ListItem>
                            <ListItem>
                                <strong>Contact Information</strong> – If you provide contact details for support or
                                communication.
                            </ListItem>
                            <ListItem>
                                <strong>User-Generated Content</strong> – Any data or content you voluntarily provide in
                                the App.
                            </ListItem>
                        </UnorderedList>

                        <Text mb={2} fontWeight="bold">b) Non-Personal Information</Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>
                                <strong>Device Information</strong> – Including model, operating system version, and
                                unique
                                device identifiers.
                            </ListItem>
                            <ListItem>
                                <strong>Usage Data</strong> – Information about how you interact with our App, such as
                                features used and time spent.
                            </ListItem>
                            <ListItem>
                                <strong>Analytics Data</strong> – To improve our services and enhance user experience.
                            </ListItem>
                        </UnorderedList>

                        <Text mb={4}>
                            We process relevant and required information regarding you, your company and/or employees to
                            accurately
                            provide services to you. The types of information listed above will only be obtained if it
                            is directly
                            applicable to your situation and the services requested from us. To enquire about any
                            personal
                            information we may retain about you, please email us at{" "}
                            <a href="mailto:gdpr@perygon.co.uk"><Text as={'span'}
                                                                      color={"perygonPink"}>gdpr@perygon.co.uk</Text></a>
                        </Text>

                        <Text mt={6} mb={2} fontWeight="bold">
                            For Suppliers
                        </Text>
                        <Text mb={4}>
                            To ensure smooth business operations, we hold a small amount of supplier information. This
                            information
                            will be held identifying contact individuals within your business, including but not limited
                            to:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>Contact name</ListItem>
                            <ListItem>Business address</ListItem>
                            <ListItem>Contact number</ListItem>
                            <ListItem>Email address</ListItem>
                        </UnorderedList>
                        <Text mb={4}>
                            We may also hold bank details or other preferred methods of payment to compensate services
                            rendered for a
                            reasonable time after the transaction. This may include (but is not limited to) invoices,
                            contracts, and
                            emails regarding the details of services used by Sedulo.
                        </Text>

                        {/* HOW DO WE COLLECT YOUR DATA */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            3. HOW DO WE COLLECT YOUR DATA?
                        </Heading>
                        <Text mb={4}>
                            The data we hold is legitimately gained either through direct contact with the customer (to
                            ensure
                            accurate and relevant information is given with full consent) or through a GDPR-compliant
                            third party
                            (e.g., lead generation). We will not hold data that has not been scrutinised as
                            GDPR-compliant. Ways we
                            collect data include but are not limited to:
                        </Text>
                        <Text fontWeight="bold">For Clients:</Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>Receiving calls from you in relation to any services within your
                                business.</ListItem>
                            <ListItem>Conducting any relevant service for your business.</ListItem>
                            <ListItem>Team members contacting you by means of business development activity.</ListItem>
                            <ListItem>Attending business networking events with clients.</ListItem>
                            <ListItem>When you have been identified as a reference provider.</ListItem>
                        </UnorderedList>

                        <Text fontWeight="bold">For App users:</Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>To authenticate users via SSO login (Google/Microsoft).</ListItem>
                            <ListItem>To operate and enhance our App’s features.</ListItem>
                            <ListItem>To personalise user experience based on preferences and interactions.</ListItem>
                            <ListItem>To provide customer support and respond to enquiries.</ListItem>
                            <ListItem>To monitor app performance and analyse trends.</ListItem>
                            <ListItem>To comply with legal and regulatory obligations.</ListItem>
                        </UnorderedList>

                        <Text fontWeight="bold">For Suppliers:</Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>When a purchase has been made.</ListItem>
                            <ListItem>Information provided on your invoice, contract, or email.</ListItem>
                        </UnorderedList>

                        {/* WHAT IS OUR LEGAL BASIS FOR PROCESSING YOUR DATA? */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            4. WHAT IS OUR LEGAL BASIS FOR PROCESSING YOUR DATA?
                        </Heading>
                        <Text mb={2}>
                            We may rely on the following reasons:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>
                                <strong>Contractual:</strong> We may process personal data in order to perform our
                                contractual
                                obligations with the relevant individuals or organisations.
                            </ListItem>
                            <ListItem>
                                <strong>Consent:</strong> We may hold and process personal data where you have
                                authorised us to do so.
                            </ListItem>
                            <ListItem>
                                <strong>Legitimate Interest:</strong> &quot;processing is necessary for the purpose of
                                the legitimate
                                interest pursued by the controller or by the third party except where such interests are
                                overridden
                                by the interests or fundamental rights and freedoms of the data subject which require
                                protection of
                                personal data.&quot;
                            </ListItem>
                            <ListItem>
                                <strong>Legal &amp; Regulatory Compliance:</strong> Certain laws require businesses to
                                retain user
                                data for a specific period to comply with regulatory, tax, or law enforcement
                                requirements.
                            </ListItem>
                        </UnorderedList>

                        {/* WHY DO WE COLLECT YOUR DATA? */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            5. WHY DO WE COLLECT YOUR DATA?
                        </Heading>
                        <Text mb={4}>
                            Our core business activity is to provide clients with financial advice and accountancy
                            services. To
                            accomplish this, we gather personal information regarding the relevant contact at the
                            business including:
                            full name, position within the business, email address, phone contact details, and other
                            information
                            freely provided by the contact.
                        </Text>

                        {/* HOW DO WE USE YOUR DATA? */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            6. HOW DO WE USE YOUR DATA?
                        </Heading>

                        <Text fontWeight="bold" mb={2}>For Clients:</Text>
                        <Text mb={4}>
                            In order to provide the best service, your data may be used in one or more of the following
                            ways:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>
                                Storing and updating your information on our client systems so that we can contact you
                                in relation
                                to business activity.
                            </ListItem>
                            <ListItem>
                                Making contact in relation to business activity, either by portal, email, telephone, or
                                in person.
                            </ListItem>
                            <ListItem>
                                Sending marketing information about events we are holding that may be of interest to
                                you.
                            </ListItem>
                            <ListItem>
                                Sending marketing information in relation to the services we can provide.
                            </ListItem>
                            <ListItem>
                                Keeping records of conversations, emails, and meetings to refer to if needed in relation
                                to any dispute.
                            </ListItem>
                        </UnorderedList>
                        <Text mb={4}>
                            For some of the above activities, your consent is required. For more information on how we
                            get and manage
                            your consent, please refer to the <strong>Consent</strong> section below.
                        </Text>

                        <Text fontWeight="bold" mb={2}>For Apps:</Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>To authenticate users via SSO login (Google/Microsoft).</ListItem>
                            <ListItem>To operate and enhance our App’s features.</ListItem>
                            <ListItem>To personalise user experience based on preferences and interactions.</ListItem>
                            <ListItem>To provide customer support and respond to inquiries.</ListItem>
                            <ListItem>To monitor app performance and analyse trends.</ListItem>
                        </UnorderedList>

                        <Heading as="h3" size="md" mt={6} mb={2}>
                            CHILDREN’S PRIVACY
                        </Heading>
                        <Text mb={4}>
                            Our Apps are not intended for children under 13 years of age. We do not knowingly collect
                            personal
                            data from minors.
                        </Text>

                        {/* WHO DO WE SHARE YOUR DATA WITH? */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            7. WHO DO WE SHARE YOUR DATA WITH?
                        </Heading>
                        <Text mb={4}>
                            In some circumstances, we may need to share your details with third parties for us to be
                            able to provide
                            you with our services. This would include:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>Sedulo Member firms and associated trading names.</ListItem>
                            <ListItem>
                                Third-Party Services that support us as we provide our services (e.g., telecommunication
                                systems,
                                IT support systems, archiving services, document production services, Cloud-based
                                software systems
                                and hosts, Google, Microsoft, Apple).
                            </ListItem>
                            <ListItem>
                                Professional advisers, including lawyers, auditors, insurers, and other accountancy
                                firms.
                            </ListItem>
                            <ListItem>
                                A potential buyer, transferee, merger partner, or seller and their advisers in
                                connection with an
                                actual or potential transfer or merger of part or all of a business or its assets.
                            </ListItem>
                            <ListItem>Mortgage providers and lending agencies.</ListItem>
                            <ListItem>
                                Parties that support us with anti-money laundering, client conflicts, and independence
                                checks.
                            </ListItem>
                            <ListItem>
                                Law enforcement or government bodies (e.g., HMRC) or other third parties as required by
                                applicable
                                law or regulation.
                            </ListItem>
                            <ListItem>Payment, marketing, and recruitment service providers.</ListItem>
                        </UnorderedList>
                        <Text mb={4}>
                            Sedulo will not transfer the personal information you provide to any third parties for their
                            own direct
                            marketing use.
                        </Text>

                        {/* HOW DO WE SAFEGUARD YOUR DATA? */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            8. HOW DO WE SAFEGUARD YOUR DATA?
                        </Heading>
                        <Text mb={4}>
                            Your data is of the utmost importance to us and as such we ensure all relevant security is
                            in place to
                            keep your data safe and protected from any potential threats. For more information on how we
                            do this,
                            please refer to our Data Protection Policy.
                        </Text>
                        <Text mb={4}>
                            Under our legitimate business interest or for legal obligations, certain information has a
                            legal
                            requirement to be kept for a predetermined amount of time, regardless of active services
                            retained with us:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>HMRC records – 6 years</ListItem>
                            <ListItem>Payroll information – 7 years</ListItem>
                            <ListItem>Accounts information – 7 years</ListItem>
                            <ListItem>Pension transfer – 7 years</ListItem>
                            <ListItem>Final salary pension transfer – kept indefinitely</ListItem>
                            <ListItem>
                                App information will be kept for as long as necessary to provide our services and to
                                meet any
                                contractual obligations
                            </ListItem>
                        </UnorderedList>

                        {/* YOUR RIGHTS */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            9. YOUR RIGHTS
                        </Heading>
                        <Text mb={4}>
                            GDPR provides the following rights:
                        </Text>

                        {/* RIGHT TO BE INFORMED */}
                        <Heading as="h3" size="md" mt={4} mb={2}>
                            The Right to Be Informed
                        </Heading>
                        <Text mb={4}>
                            You have the right to be informed about the collection and use of your personal data. All
                            this
                            information is provided by means of this Privacy Notice.
                        </Text>

                        {/* RIGHT OF ACCESS */}
                        <Heading as="h3" size="md" mt={4} mb={2}>
                            The Right of Access
                        </Heading>
                        <Text mb={4}>
                            You have the right to access your personal data and any supplementary information. This is
                            known as a
                            Data Subject Access Request (DSAR). When received by our designated Data Controller, we are
                            legally
                            required to provide this information within one month. This information will be provided
                            free of charge
                            unless the request is manifestly unfounded or excessive.
                        </Text>

                        {/* RIGHT TO RECTIFICATION */}
                        <Heading as="h3" size="md" mt={4} mb={2}>
                            The Right to Rectification
                        </Heading>
                        <Text mb={4}>
                            You have the right to have any inaccurate personal data rectified if incomplete or
                            incorrect. If we feel
                            the request is manifestly unfounded or excessive, particularly if it is repetitive, we can
                            charge a fee
                            or refuse the request. If either of these apply, we will provide you with our reasons for
                            such action.
                        </Text>

                        {/* RIGHT TO ERASURE */}
                        <Heading as="h3" size="md" mt={4} mb={2}>
                            The Right to Erasure
                        </Heading>
                        <Text mb={4}>
                            Also known as the right to be forgotten, you have the right to have your personal data
                            erased if:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>The data is no longer necessary for the reason it was originally collected or
                                processed.</ListItem>
                            <ListItem>
                                Your data has been processed for legitimate interest and you object to the processing of
                                your data,
                                and we cannot provide an overriding legitimate interest to continue processing.
                            </ListItem>
                            <ListItem>The data has been processed unlawfully (in breach of GDPR).</ListItem>
                            <ListItem>Data must be erased to comply with a legal obligation.</ListItem>
                        </UnorderedList>
                        <Text mb={4}>
                            If we process your data for one of the following reasons, the right to erasure does not
                            apply:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>To exercise the right of freedom of expression and information.</ListItem>
                            <ListItem>To comply with a legal obligation.</ListItem>
                            <ListItem>For the performance of a task carried out in the public interest.</ListItem>
                            <ListItem>For archiving purposes in the public interest or statistical purposes.</ListItem>
                            <ListItem>In the defence of a claim.</ListItem>
                        </UnorderedList>

                        {/* RIGHT TO RESTRICT PROCESSING */}
                        <Heading as="h3" size="md" mt={4} mb={2}>
                            The Right to Restrict Processing
                        </Heading>
                        <Text mb={4}>
                            You have the right to restrict the processing of your data in certain circumstances. When
                            processing is
                            restricted we may store enough information to ensure future restriction is respected. We
                            will stop
                            processing your data if:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>You do not agree with the accuracy of your personal data.</ListItem>
                            <ListItem>The data has been unlawfully processed.</ListItem>
                            <ListItem>To establish or defend a legal claim.</ListItem>
                            <ListItem>You object to our legal ground for processing your data.</ListItem>
                        </UnorderedList>
                        <Text mb={4}>
                            We can only continue to process your data when the above has been resolved, and we will
                            inform you
                            before any restriction is lifted.
                        </Text>
                        <Text mb={4}>
                            If your data is restricted it can only be retained if:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>You give your consent to processing.</ListItem>
                            <ListItem>It is in defence of a legal claim.</ListItem>
                            <ListItem>It is for the protection of another person.</ListItem>
                            <ListItem>It is for reasons of important public interest.</ListItem>
                        </UnorderedList>

                        {/* RIGHT TO DATA PORTABILITY */}
                        <Heading as="h3" size="md" mt={4} mb={2}>
                            The Right to Data Portability
                        </Heading>
                        <Text mb={4}>
                            You have the right to transfer your details across different services. This right only
                            applies if:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>Data that has been provided to a controller by an individual.</ListItem>
                            <ListItem>Processing is based on consent or for the performance of a contract.</ListItem>
                            <ListItem>Processing is carried out by automated means.</ListItem>
                        </UnorderedList>
                        <Text mb={4}>
                            When we receive a portability request, we must respond within one month of the Data
                            Controller being
                            notified, and no fee is applicable. We must provide the information in a structured,
                            commonly used,
                            and machine-readable form.
                        </Text>

                        {/* RIGHT TO OBJECT */}
                        <Heading as="h3" size="md" mt={4} mb={2}>
                            The Right to Object
                        </Heading>
                        <Text mb={4}>
                            You can object to the processing of your data when it is processed under one of the
                            following reasons:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>Our legitimate interest.</ListItem>
                            <ListItem>Performance of a task in the public interest/exercise of official
                                authority.</ListItem>
                            <ListItem>Direct marketing.</ListItem>
                            <ListItem>Processing for scientific/historical research or statistical purposes.</ListItem>
                        </UnorderedList>
                        <Text mb={4}>
                            Within one month of notification of this request, we must stop processing your data unless:
                        </Text>
                        <UnorderedList pl={5} mb={4}>
                            <ListItem>We can demonstrate compelling legitimate grounds for processing which override
                                your interest.</ListItem>
                            <ListItem>It is being processed for the establishment, exercise, or defence of a legal
                                claim.</ListItem>
                        </UnorderedList>
                        <Text mb={4}>
                            If your objection relates to direct marketing, we will ensure your details are either
                            removed or adjusted
                            as promptly as possible. You can start this process by clicking &quot;unsubscribe&quot; on
                            the marketing
                            email or emailing <strong>gdpr@perygon.co.uk</strong>.
                        </Text>
                        <Text mb={4}>
                            If your data has been shared with a third party and you request one of your rights listed
                            above, we will
                            notify them and act upon the requirements of your request unless this is not possible or
                            involves a
                            disproportionate effort.
                        </Text>

                        {/* CONSENT */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            10. CONSENT
                        </Heading>
                        <Text mb={4}>
                            As a business, and to comply with Article 6 of GDPR, we have agreed that the legal basis for
                            processing
                            your data will be (depending on your relationship with us) either &quot;Legitimate
                            Interest&quot; or
                            &quot;Contract.&quot; As well as complying with GDPR in relation to direct marketing, we
                            must also
                            comply with The Privacy and Electronic Communications Regulations (PECR).
                        </Text>
                        <Text mb={4}>
                            However, in certain circumstances, we are required to have your consent to perform certain
                            activities.
                            This consent can be given in the form of an opt-in or soft opt-in option. We must ensure
                            your consent is
                            freely given, you understand what you are consenting to, and you are able to opt-out or
                            opt-in at any time.
                        </Text>
                        <Text mb={4}>
                            You can opt in or out verbally during any client meeting. If you have opted in and wish to
                            opt out,
                            you can click the link provided in one of our marketing emails or contact us using the
                            methods listed
                            below.
                        </Text>

                        {/* CONTACT DETAILS */}
                        <Heading as="h2" size="lg" mt={6} mb={2} color={"perygonPink"}>
                            11. CONTACT DETAILS
                        </Heading>
                        <Text mb={4}>
                            If you need to contact us for any reason regarding your data, our details are:
                        </Text>
                        <Box mb={4}>
                            <Text>The Data Controller</Text>
                            <Text>Sedulo Accountants Limited</Text>
                            <Text>62-66 Deansgate</Text>
                            <Text>Manchester</Text>
                            <Text>M3 2EN</Text>
                            <Text mt={2}><strong>Contact Number:</strong> 0333 222 444 5</Text>
                            <Text mt={2}>
                                <strong>Email:</strong>{" "}
                                <a href="mailto:gdpr@perygon.co.uk"><Text as={'span'}
                                                                          color={"perygonPink"}>gdpr@perygon.co.uk</Text></a>
                            </Text>
                        </Box>
                        <Text mb={4}>
                            Please title any post and/or email “In relation to GDPR” to ensure it is passed to the
                            correct person.
                            Emails or calls made to other employees outside of these methods may not promptly reach the
                            Data
                            Controller to issue a response.
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
    )
        ;
}

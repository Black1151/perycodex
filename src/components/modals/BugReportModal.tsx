import { useState } from "react";
import {
    VStack,
    Text,
    Textarea,
    useToast,
    FormControl,
    FormLabel,
    Input,
    useTheme
} from "@chakra-ui/react";
import { SpringModal } from "./springModal/SpringModal";
import { BugReport, BugReport as BugReportIcon } from "@mui/icons-material";
import { useUser } from "@/providers/UserProvider";

interface BugReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BugReportModal: React.FC<BugReportModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const theme = useTheme();
    const { user } = useUser();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Create email body with user information and bug report details
            const emailBody = `
                Hi, I would like to report a bug with Perygon.
                
                Bug Report Details:
                ------------------
                Description: ${description}

                Steps to Reproduce: ${steps}

                User Information:
                ----------------
                Name: ${user?.fullName || 'Not provided'}
                Email: ${user?.email || 'Not provided'}
                Customer ID: ${user?.customerId || 'Not provided'}
                Customer Name: ${user?.customerName || 'Not provided'}
            `.trim();

            // Create mailto link
            const mailtoLink = `mailto:support@perygon.com?subject=Bug Report&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.location.href = mailtoLink;

            toast({
                title: "Bug Report Prepared",
                description: "Your email client should open with the bug report details.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            onClose();
            setDescription("");
            setSteps("");
            setEmail("");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to prepare bug report. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SpringModal
            isOpen={isOpen}
            onClose={onClose}
            showClose={true}
            frontIcon={<BugReport fontSize="inherit" />}
            header="Report a Bug"
            bg={theme.colors.primary}
            color={theme.colors.elementBG}
            body={
                <VStack spacing={4} align="stretch" w="100%">
                    <FormControl isRequired>
                        <FormLabel color={theme.colors.elementBG}>Bug Description</FormLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please describe the bug you encountered..."
                            rows={4}
                            bg={theme.colors.elementBG}
                            color={theme.colors.primaryTextColor}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel color={theme.colors.elementBG}>Steps to Reproduce</FormLabel>
                        <Textarea
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            placeholder="1. First step&#10;2. Second step&#10;3. ..."
                            rows={4}
                            bg={theme.colors.elementBG}
                            color={theme.colors.primaryTextColor}
                        />
                    </FormControl>
                </VStack>
            }
            primaryLabel="Submit Report"
            onPrimaryClick={handleSubmit}
            isPrimaryLoading={isSubmitting}
            secondaryLabel="Cancel"
            onSecondaryClick={onClose}
        />
    );
}; 
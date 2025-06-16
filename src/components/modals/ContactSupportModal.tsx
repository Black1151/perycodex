import { useState } from "react";
import { Textarea, useTheme } from "@chakra-ui/react";
import { Chat } from "@mui/icons-material";
import { SpringModal } from "./springModal/SpringModal";
import { useUser } from "@/providers/UserProvider";
import { SUPPORT_EMAIL } from "@/utils/emailAddresses";

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSupportModal = ({ isOpen, onClose }: ContactSupportModalProps) => {
  const [contactMessage, setContactMessage] = useState("");
  const theme = useTheme();
  const { user } = useUser();

  const handleContactSubmit = () => {
    const userDetails = `
Customer Name: ${user?.customerName || 'N/A'}
Customer ID: ${user?.customerId || 'N/A'}
User Email: ${user?.email || 'N/A'}

Message:
${contactMessage}`;
    
    const emailBody = encodeURIComponent(userDetails);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Help Centre Support Request&body=${emailBody}`;
    onClose();
    setContactMessage("");
  };

  return (
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={true}
      bg={theme.colors.primary}
      color="white"
      frontIcon={<Chat />}
      bgIcon={<Chat />}
      header="Contact Support"
      body={
        <Textarea
          placeholder="Please describe what you need help with..."
          value={contactMessage}
          onChange={(e) => setContactMessage(e.target.value)}
          size="md"
          rows={6}
          bg="white"
          color="gray.800"
        />
      }
      primaryLabel="Send Email"
      onPrimaryClick={handleContactSubmit}
      secondaryLabel="Cancel"
      onSecondaryClick={onClose}
    />
  );
}; 
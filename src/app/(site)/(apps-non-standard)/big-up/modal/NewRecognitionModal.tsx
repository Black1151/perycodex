import { Box, Text, useTheme } from "@chakra-ui/react";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { hideScrollbar } from "@/utils/style/style-utils";
import { Favorite } from "@mui/icons-material";

export interface UserStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unreadRecognitionModalData: React.ReactNode;
}

export const NewRecognitionModal: React.FC<UserStatsModalProps> = ({
  isOpen,
  onClose,
  unreadRecognitionModalData,
}) => {
  const theme = useTheme();

  return (
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={true}
      bg={theme.colors.primary}
      color="white"
      frontIcon={<Favorite />}
      bgIcon={<Favorite />}
      header="Your colleagues appreciate you!"
      body={
        <Box
          maxH={[400, 610]}
          overflowY="auto"
          sx={{
            "@media (max-width: 400px)": {
              ...hideScrollbar,
            },
          }}
        >
          {unreadRecognitionModalData}
        </Box>
      }
      primaryLabel="Thanks Guys!"
      onPrimaryClick={onClose}
      primaryIcon={<Favorite />}
    />
  );
};

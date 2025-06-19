import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Textarea,
  Text,
  useTheme,
} from "@chakra-ui/react";
import { BigUpTeamMember } from "../types";
import TeamMemberAutocomplete from "../components/TeamMemberAutocomplete";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { EmojiEvents } from "@mui/icons-material";

interface SubmitScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  teamMembers: BigUpTeamMember[];
  categories: { id: number; name: string, points: number }[];
}

const SubmitScoreModal: React.FC<SubmitScoreModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamMembers,
  categories,
}) => {
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teamMember: "",
      category: "",
      message: "",
    },
  });

  const message = watch("message", "");
  const maxLength = 255;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const theme = useTheme();

  return (
    <SpringModal
      isOpen={isOpen}
      onClose={handleClose}
      showClose={true}
      bg={theme.colors.primary}
      color="white"
      frontIcon={<EmojiEvents />}
      bgIcon={<EmojiEvents />}
      header="Give Recognition"
      body={
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          {/* TEAM MEMBER */}
          <FormControl mb={4} isRequired isInvalid={!!errors.teamMember}>
            <FormLabel color="white">Team Member</FormLabel>
            <Controller
              name="teamMember"
              control={control}
              rules={{ required: "Team Member is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TeamMemberAutocomplete
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  teamMembers={teamMembers}
                  placeholder="Start typing to search..."
                />
              )}
            />
            <FormErrorMessage>{errors.teamMember?.message}</FormErrorMessage>
          </FormControl>

          {/* CATEGORY */}
          <FormControl mb={4} isRequired isInvalid={!!errors.category}>
            <FormLabel color="white">Category</FormLabel>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Choose a category..."
                  {...field}
                  bg="white"
                  color="gray.800"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: "whiteAlpha.400" }}
                  _focus={{ bg: "white", color: "gray.800" }}
                  sx={{
                    option: {
                      backgroundColor: "white",
                      color: "gray.800",
                    },
                  }}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}{category.points ? ` +${category.points}pts` : ''}
                    </option>
                  ))}
                </Select>
              )}
            />
            <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
          </FormControl>

          {/* MESSAGE */}
          <FormControl mb={4} isRequired isInvalid={!!errors.message}>
            <FormLabel color="white">Message</FormLabel>
            <Controller
              name="message"
              control={control}
              rules={{ required: "Message is required" }}
              render={({ field }) => (
                <>
                  <Textarea
                    placeholder="Enter your message here..."
                    maxLength={maxLength}
                    {...field}
                    bg="white"
                    color="gray.800"
                    borderColor="whiteAlpha.300"
                    _hover={{ borderColor: "whiteAlpha.400" }}
                  />
                  <Text fontSize="sm" color="whiteAlpha.800">
                    {message.length}/{maxLength} characters
                  </Text>
                </>
              )}
            />
            <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
          </FormControl>
        </form>
      }
      primaryLabel="Submit"
      onPrimaryClick={handleSubmit(handleFormSubmit)}
      secondaryLabel="Cancel"
      onSecondaryClick={handleClose}
      primaryIcon={<EmojiEvents />}
    />
  );
};

export default SubmitScoreModal;

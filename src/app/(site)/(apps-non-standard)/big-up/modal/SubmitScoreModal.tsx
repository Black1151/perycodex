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
  useBreakpointValue,
} from "@chakra-ui/react";
import { BigUpTeamMember } from "../types";
import TeamMemberAutocomplete from "../components/TeamMemberAutocomplete";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { EmojiEvents } from "@mui/icons-material";
import CustomCategoryDropdown from "./components/CustomCategoryDropdown";
import MobileDrawerSelector from "@/components/modals/MobileDrawerSelector";

interface SubmitScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  teamMembers: BigUpTeamMember[];
  categories: {
    id: number;
    name: string;
    points: number;
    giverPoints: number;
    isActive: boolean;
  }[];
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

  // Only include active categories
  const activeCategories = categories.filter((cat) => cat.isActive);

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
  const isMobile = useBreakpointValue({ base: true, md: false });

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
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field, fieldState }) =>
                isMobile ? (
                  <>
                    <FormLabel color="white">Category</FormLabel>
                    <MobileDrawerSelector
                      items={activeCategories.map((cat) => ({
                        id: cat.id,
                        label: `${cat.name} ${cat.points ? ` +${cat.points} reciever pts` : ""} ${cat.giverPoints ? ` +${cat.giverPoints} giver pts` : ""}`,
                      }))}
                      selectedId={field.value}
                      onSelect={field.onChange}
                      triggerLabel={
                        activeCategories.find(
                          (cat) => String(cat.id) === String(field.value)
                        )?.name || "Choose a category..."
                      }
                    />
                  </>
                ) : (
                  <CustomCategoryDropdown
                    categories={activeCategories}
                    value={field.value}
                    onChange={field.onChange}
                    isInvalid={!!errors.category}
                    isRequired
                    errorMessage={errors.category?.message}
                  />
                )
              }
            />
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

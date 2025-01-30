import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { BigUpTeamMember } from "./types";
import TeamMemberAutocomplete from "./TeamMemberAutocomplete";

interface SubmitScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  teamMembers: BigUpTeamMember[];
  categories: { id: number; name: string }[];
}

const SubmitScoreModal: React.FC<SubmitScoreModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamMembers,
  categories,
}) => {
  const { handleSubmit, control, watch, reset } = useForm({
    defaultValues: {
      teamMember: "",
      category: "",
      message: "",
    },
  });

  const message = watch("message", "");
  const maxLength = 100;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="rgba(0, 0, 0, 0.85)"
        boxShadow="0 0 10px 2px rgba(255, 20, 147, 0.8)"
        mx={4}
      >
        <ModalHeader color="perygonPink" fontSize="2xl">
          Give Recognition
        </ModalHeader>
        <ModalCloseButton color="white" />
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody>
            <FormControl mb={4} isRequired>
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
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel color="white">Category</FormLabel>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    placeholder="Choose a category..."
                    {...field}
                    bg="rgba(0, 0, 0, 0.85)"
                    color="perygonPink"
                    borderColor="perygonPink"
                    _hover={{ borderColor: "perygonPink" }}
                    _focus={{ bg: "black", color: "perygonPink" }}
                    sx={{
                      option: {
                        backgroundColor: "black",
                        color: "perygonPink",
                      },
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl mb={4} isRequired>
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
                      bg="rgba(0, 0, 0, 0.85)"
                      color="white"
                      borderColor="perygonPink"
                      _hover={{ borderColor: "perygonPink" }}
                    />
                    <Text fontSize="sm" color="perygonPink">
                      {message.length}/{maxLength} characters
                    </Text>
                  </>
                )}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="perygonPink"
              color="white"
              mr={3}
              type="submit"
              _hover={{ bg: "white", color: "perygonPink" }}
            >
              Submit
            </Button>
            <Button
              variant="ghost"
              onClick={handleClose}
              color="perygonPink"
              _hover={{ bg: "rgba(255, 20, 147, 0.1)" }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default SubmitScoreModal;

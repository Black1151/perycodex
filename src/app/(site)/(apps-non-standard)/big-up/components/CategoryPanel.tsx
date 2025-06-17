import {
  Box,
  Text,
  VStack,
  HStack,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Stack,
  Spacer,
  Badge,
  Divider,
  Tag,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

type Category = {
  uniqueId: number;
  name: string;
  description: string;
  points: number;
  isActive: boolean;
};

type CategoryPanelProps = {
  category: Category;
  onUpdateCategory: (updated: Category) => void;
  customerId: number | null;
  toolId: number;
};

export default function CategoryPanel({
  category,
  onUpdateCategory,
  customerId,
  toolId,
}: CategoryPanelProps) {
  // Local state for form fields
  const [editableCategory, setEditableCategory] = useState<Category>(category);
  const [hasChanges, setHasChanges] = useState(false);
  const isEditable = editableCategory.isActive;

  const toast = useToast();

  // Reset local state whenever the parent `category` prop changes
  useEffect(() => {
    setEditableCategory(category);
    setHasChanges(false);
  }, [category]);

  // Handle field changes
  const handleChange = (field: keyof Category, value: string | boolean | number) => {
    if (!isEditable && field !== "isActive") return; // Allow isActive to be changed even if category is not editable
    setEditableCategory((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  // Toggle Active/Inactive
  const handleActiveToggle = async (checked: boolean) => {
    if (!category.uniqueId) {
      console.error("No uniqueId found for category:", category);
      return;
    }

    const payload = {
      uniqueId: category.uniqueId,
      name: category.name,
      description: category.description,
      points: category.points,
      isActive: checked,
    };

    try {
      const resp = await fetch("/api/bigup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorJson = await resp.json().catch(() => null);
        const message = errorJson?.error || "Unknown error toggling active status";
        console.error("→ Toggle API error:", message);
        toast({
          title: "Error toggling status",
          description: message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      // Update local and parent state
      const updatedCategory: Category = {
        ...editableCategory,
        isActive: checked,
      };
      onUpdateCategory(updatedCategory);

      // If toggled off, clear any pending edits
      if (!checked) {
        setHasChanges(false);
      }

      toast({
        title: checked ? "Activated" : "Deactivated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      console.error("→ Exception in toggleActive:", err);
      toast({
        title: "Network error",
        description: "Could not toggle active status.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Save changes
  const handleSave = async () => {
    if (!hasChanges) return;
    if (!category.uniqueId) {
      console.error("No uniqueId found for category:", category);
      return;
    }

    const payload = {
      uniqueId: category.uniqueId,
      name: editableCategory.name,
      description: editableCategory.description,
      points: editableCategory.points,
      isActive: editableCategory.isActive,
    };

    try {
      const resp = await fetch("/api/bigup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorJson = await resp.json().catch(() => null);
        const message = errorJson?.error || "Unknown error saving changes";
        console.error("→ Save API error:", message);
        toast({
          title: "Error saving changes",
          description: message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      // Update parent state
      onUpdateCategory(editableCategory);
      setHasChanges(false);

      toast({
        title: "Changes saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      console.error("→ Exception in save:", err);
      toast({
        title: "Network error",
        description: "Could not save changes.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="medium">
          {category.name}
        </Text>
        <HStack spacing={2}>
          <Badge
            colorScheme={editableCategory.isActive ? "green" : "red"}
            variant="subtle"
          >
            {editableCategory.isActive ? "Active" : "Inactive"}
          </Badge>
          <Switch
            isChecked={editableCategory.isActive}
            onChange={(e) => handleActiveToggle(e.target.checked)}
          />
        </HStack>
      </HStack>

      <Divider />

      <Stack spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="normal">Name</FormLabel>
          <Input
            value={editableCategory.name}
            onChange={(e) => handleChange("name", e.target.value)}
            isDisabled={!isEditable}
            placeholder="Enter category name"
            variant="flushed"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="normal">Description</FormLabel>
          <Textarea
            value={editableCategory.description}
            onChange={(e) => handleChange("description", e.target.value)}
            isDisabled={!isEditable}
            placeholder="Enter category description"
            rows={3}
            variant="flushed"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="normal">Points</FormLabel>
          <Input
            type="number"
            value={editableCategory.points}
            onChange={(e) => handleChange("points", parseInt(e.target.value))}
            isDisabled={!isEditable}
            placeholder="Enter points value"
            variant="flushed"
          />
        </FormControl>
      </Stack>

      {hasChanges && (
        <Box pt={4} textAlign="right">
          <Button
            colorScheme="green"
            onClick={handleSave}
            isDisabled={!isEditable}
          >
            Save Changes
          </Button>
        </Box>
      )}
    </VStack>
  );
} 
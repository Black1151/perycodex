import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  VStack,
  Text,
  Box,
  Spinner,
  useBreakpointValue,
  useTheme,
  IconButton,
  Alert,
  AlertIcon,
  Flex,
  Badge,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import CategoryPanel from "./CategoryPanel";
import { Lock } from "@mui/icons-material";

type Category = {
  uniqueId: number;
  name: string;
  description: string;
  points: number;
  isActive: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  toolId: number;
  customerId: number | null;
  isFree: boolean;
};

export default function CategoriesModal({
  isOpen,
  onClose,
  toolId,
  customerId,
  isFree,
}: Props) {
  /* ─────────────────────────────── UI helpers ────────────────────────────── */
  const isMobile = useBreakpointValue({ base: true, md: false });
  const theme = useTheme();
  const bg = theme.colors.elementBG;

  /* ────────────────────────────── component state ────────────────────────── */
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Category | null>(null);

  /* ──────────────────────────── data fetch: categories ────────────────────── */
  const fetchCategories = useCallback(async () => {
    if (!customerId) {
      setCategories([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/bigup?customerId=${customerId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("categories request failed");
      const json = await res.json();
      console.log("[CategoriesModal] API Response:", json);

      if (!json?.resource?.length) {
        setCategories([]);
        return;
      }

      // Map the API response to our Category type
      const categories = json.resource.map((item: any) => ({
        uniqueId: item.id,
        name: item.name,
        description: item.description,
        points: item.points,
        isActive: item.isActive,
      }));

      console.log("[CategoriesModal] Mapped categories:", categories);
      setCategories(categories);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  /* fetch categories whenever the modal opens */
  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen, fetchCategories]);

  /* re-evaluate selected category after every fetch */
  useEffect(() => {
    if (!categories.length) {
      setSelected(null);
      return;
    }

    setSelected(
      (prev) =>
        categories.find((c) => c.uniqueId === prev?.uniqueId) ?? categories[0]
    );
  }, [categories]);

  const CategoryCard = (category: Category) => {
    const locked = isFree && !category.isActive;

    return (
      <Box
        key={category.uniqueId}
        position="relative"
        border="1px solid"
        borderColor={
          selected?.uniqueId === category.uniqueId ? "blue.400" : "gray.200"
        }
        borderRadius="md"
        h="min"
        p={3}
        mb={2}
        opacity={locked ? 0.5 : 1}
        _hover={{
          cursor: locked ? "not-allowed" : "pointer",
          bg: locked ? undefined : "gray.50",
        }}
        onClick={() => {
          if (!locked) {
            setSelected(category);
          }
        }}
      >
        <Flex direction="column" align="start" w="full">
          <HStack justifyContent="space-between" w="full" mb={1}>
            <HStack>
              <Text fontWeight="medium">{category.name}</Text>
              {locked && <Lock fontSize="small" />}
            </HStack>
            <Badge
              colorScheme={category.isActive ? "green" : "red"}
              variant="subtle"
            >
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </HStack>
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {category.description}
          </Text>
          <Badge colorScheme="blue" variant="subtle" mt={2}>
            {category.points} points
          </Badge>
        </Flex>
      </Box>
    );
  };

  function SpinnerBlock() {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  function ErrorAlert({ message }: { message: string }) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        {message}
      </Alert>
    );
  }

  function Header({ total }: { total: number }) {
    return (
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="medium">
          Categories ({total})
        </Text>
      </Flex>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isMobile ? "full" : "6xl"}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent
        bg={bg}
        maxH="90vh"
        h={isMobile ? "100vh" : "auto"}
        borderRadius={isMobile ? 0 : "md"}
      >
        <ModalCloseButton />
        <ModalBody p={6}>
          {loading ? (
            <SpinnerBlock />
          ) : error ? (
            <ErrorAlert message={error} />
          ) : (
            <Flex
              direction={isMobile ? "column" : "row"}
              gap={6}
              h="full"
            >
              {/* Left side: List of categories */}
              <Box
                flex={1}
                maxH={isMobile ? "50vh" : "70vh"}
                overflowY="auto"
                pr={2}
              >
                <Header total={categories.length} />
                <VStack spacing={2} align="stretch">
                  {categories.map((category) => CategoryCard(category))}
                </VStack>
              </Box>

              {/* Right side: Edit panel */}
              {selected && (
                <Box
                  flex={1}
                  maxH={isMobile ? "50vh" : "70vh"}
                  overflowY="auto"
                  borderLeft={isMobile ? "none" : "1px solid"}
                  borderTop={isMobile ? "1px solid" : "none"}
                  borderColor="gray.200"
                  pl={isMobile ? 0 : 6}
                  pt={isMobile ? 6 : 0}
                >
                  <CategoryPanel
                    category={selected}
                    onUpdateCategory={(updated: Category) => {
                      setCategories((prev) =>
                        prev.map((c) =>
                          c.uniqueId === updated.uniqueId ? updated : c
                        )
                      );
                    }}
                    customerId={customerId || 0}
                    toolId={toolId}
                  />
                </Box>
              )}
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

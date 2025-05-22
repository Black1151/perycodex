import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Flex,
  Box,
  VStack,
  Text,
  Spinner,
  useBreakpointValue,
  useColorModeValue,
  Button,
  Checkbox as ChakraCheckbox,
  HStack,
  Image,
} from "@chakra-ui/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Article } from "@mui/icons-material";
import { useFetchClient } from "@/hooks/useFetchClient";

type ToolGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  toolId: number | string;
};

type Guide = {
  title: string;
  urlPath: string;
  listOrder: number;
};

export default function ToolGuideModal({
  isOpen,
  onClose,
  toolId,
}: ToolGuideModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guideList, setGuideList] = useState<Guide[]>([]);
  const [guideHTML, setGuideHTML] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [readGuides, setReadGuides] = useState<Record<string, boolean>>({});
  const [pdfLoading, setPdfLoading] = useState(true);
  const [iconImageUrl, setIconImageUrl] = useState<string | null>(null);
  const { fetchClient } = useFetchClient();

  // Reset pdf-loading overlay whenever we pick a new guide
  useEffect(() => {
    if (selectedGuide) {
      setPdfLoading(true);
    }
  }, [selectedGuide]);

  // Fetch guides & HTML on open
  useEffect(() => {
    if (!isOpen) {
      setGuideList([]);
      setSelectedGuide(null);
      setGuideHTML(null);
      setError(null);
      setIconImageUrl(null);
      setLoading(true);
      return;
    }

    const fetchToolConfig = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchClient<{
          resource?: {
            guideHtml: string | null;
            guideFilePath: string | null;
            guideList: string | Guide[];
            iconImageUrl: string | null;
          };
        }>(`/api/toolConfig/findBy?id=${toolId}`, {
          method: "GET",
        });

        if (!data?.resource) {
          throw new Error("No resource found in response");
        }

        const { guideHtml, guideList: raw, iconImageUrl } = data.resource;
        if (guideHtml) {
          setGuideHTML(guideHtml);
        }

        setIconImageUrl(iconImageUrl || null);

        let parsedList: Guide[] = [];
        if (raw) {
          parsedList =
            typeof raw === "string" ? JSON.parse(raw) : (raw as Guide[]);
        }

        const sorted = parsedList.slice().sort((a, b) => a.listOrder - b.listOrder);
        setGuideList(sorted);
        if (sorted.length) {
          setSelectedGuide(sorted[0]);
        }
      } catch (err: any) {
        console.error("Failed to load tool config:", err);
        setError(err.message || "Unable to fetch tool guides.");
      } finally {
        setLoading(false);
      }
    };

    fetchToolConfig();
  }, [isOpen, toolId]);

  const bg = useColorModeValue("white", "gray.800");
  const sideWidth = useBreakpointValue({ base: "100%", md: "30%" });
  const mainWidth = useBreakpointValue({ base: "100%", md: "70%" });

  const handlePrev = () => {
    if (!selectedGuide) return;
    const idx = guideList.findIndex((g) => g.urlPath === selectedGuide.urlPath);
    if (idx > 0) setSelectedGuide(guideList[idx - 1]);
  };
  const handleNext = () => {
    if (!selectedGuide) return;
    const idx = guideList.findIndex((g) => g.urlPath === selectedGuide.urlPath);
    if (idx < guideList.length - 1) setSelectedGuide(guideList[idx + 1]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent height="80vh">
        <ModalCloseButton />
        <ModalBody px={0} py={0} borderRadius="xl">
          <HStack justify="start" p={4} bg={bg}>
            {!loading && iconImageUrl && (
              <Image src={iconImageUrl} boxSize="50px" alt="Tool icon" />
            )}
            <Text fontSize="2xl" fontWeight="bold">
              Tool Guide
            </Text>
          </HStack>

          {loading ? (
            <Flex align="center" justify="center" h="100%">
              <Spinner size="xl" />
            </Flex>
          ) : error ? (
            <Text color="red.500" textAlign="center">
              {error}
            </Text>
          ) : (
            <Flex h="full" direction={{ base: "column", md: "row" }}>
              {/* Sidebar */}
              <Box
                w={sideWidth}
                borderRightWidth={{ base: 0, md: "1px" }}
                borderBottomWidth={{ base: "1px", md: 0 }}
                borderColor="gray.200"
                overflowY="auto"
                px={4}
                py={2}
                bg={bg}
              >
                <VStack align="stretch" spacing={2}>
                  {guideHTML && guideList.length === 0 ? (
                    <Box>
                      <Text mb={2} fontWeight="bold">
                        Guide
                      </Text>
                      <Box
                        p={2}
                        bg={useColorModeValue("gray.50", "gray.700")}
                        borderRadius="md"
                        overflowY="auto"
                        maxH="80vh"
                        dangerouslySetInnerHTML={{ __html: guideHTML }}
                      />
                    </Box>
                  ) : (
                    guideList.map((guide) => (
                      <Button
                        key={guide.urlPath}
                        justifyContent="space-between"
                        variant={
                          selectedGuide?.urlPath === guide.urlPath
                            ? "solid"
                            : "ghost"
                        }
                        onClick={() => setSelectedGuide(guide)}
                      >
                        <HStack spacing={2}>
                          <Box
                            p={
                              selectedGuide?.urlPath === guide.urlPath
                                ? 0.5
                                : 0
                            }
                          >
                            <Article />
                          </Box>
                          <Text>{guide.title}</Text>
                        </HStack>
                        {readGuides[guide.urlPath] && (
                          <CheckCircleIcon
                            style={{
                              color: "#07ad4c",
                              background:
                                selectedGuide?.urlPath === guide.urlPath
                                  ? "#fff"
                                  : "transparent",
                              borderRadius: "50%",
                            }}
                          />
                        )}
                      </Button>
                    ))
                  )}
                </VStack>
              </Box>

              {/* Main PDF viewer */}
              {!guideHTML && selectedGuide && (
                <Flex direction="column" w={mainWidth} h="full" bg="gray.50">
                  <Box flex="1" position="relative">
                    {pdfLoading && (
                      <Flex
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        align="center"
                        justify="center"
                        bg="gray.50"
                        zIndex="1"
                      >
                        <Spinner size="xl" />
                      </Flex>
                    )}
                    <embed
                      src={`${selectedGuide.urlPath}#toolbar=0&navpanes=0&scrollbar=0`}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                      onLoad={() => setPdfLoading(false)}
                    />
                  </Box>
                  <Flex p={4} justify="space-between" align="center" bg={bg}>
                    <Button
                      onClick={handlePrev}
                      isDisabled={
                        guideList[0]?.urlPath === selectedGuide.urlPath
                      }
                    >
                      Previous
                    </Button>
                    <ChakraCheckbox
                      isChecked={!!readGuides[selectedGuide.urlPath]}
                      onChange={(e) =>
                        setReadGuides((prev) => ({
                          ...prev,
                          [selectedGuide.urlPath]: e.target.checked,
                        }))
                      }
                    >
                      Mark as read
                    </ChakraCheckbox>
                    <Button
                      onClick={handleNext}
                      isDisabled={
                        guideList[guideList.length - 1]?.urlPath ===
                        selectedGuide.urlPath
                      }
                    >
                      Next
                    </Button>
                  </Flex>
                </Flex>
              )}

              {!guideHTML && !selectedGuide && (
                <Flex align="center" justify="center" w={mainWidth}>
                  <Text>No guide selected.</Text>
                </Flex>
              )}
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

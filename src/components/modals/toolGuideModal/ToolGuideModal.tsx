import React, { useEffect, useState, useCallback } from "react";
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
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Article, Menu, Check } from "@mui/icons-material";
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
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  // Reset PDF-spinner when guide changes
  useEffect(() => {
    if (selectedGuide) setPdfLoading(true);
  }, [selectedGuide]);

  // Fetch config once open
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
    const fetchConfig = async () => {
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
        }>(`/api/toolConfig/findBy?id=${toolId}`);
        if (!data?.resource) throw new Error("No resource found");
        const { guideHtml, guideList: raw, iconImageUrl } = data.resource;
        setGuideHTML(guideHtml);
        setIconImageUrl(iconImageUrl || null);
        const parsed: Guide[] = raw
          ? typeof raw === "string"
            ? JSON.parse(raw)
            : raw
          : [];
        const sorted = parsed.slice().sort((a, b) => a.listOrder - b.listOrder);
        setGuideList(sorted);
        if (sorted.length) setSelectedGuide(sorted[0]);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load guides");
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [isOpen, toolId]);

  const bg = useColorModeValue("white", "gray.800");
  const pdfBg = useColorModeValue("white", "gray.50");
  const sideW = useBreakpointValue({ base: "full", md: "30%" });
  const mainW = useBreakpointValue({ base: "full", md: "70%" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  const currentIndex = selectedGuide
    ? guideList.findIndex((g) => g.urlPath === selectedGuide.urlPath)
    : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setSelectedGuide(guideList[currentIndex - 1]);
  }, [currentIndex, guideList]);

  const handleNext = useCallback(() => {
    if (currentIndex < guideList.length - 1)
      setSelectedGuide(guideList[currentIndex + 1]);
  }, [currentIndex, guideList]);

  // Sidebar list (for both DrawerBody & desktop Box)
  const SidebarList = (
    <VStack align="stretch" spacing={2}>
      {guideList.map((g, idx) => (
        <Button
          key={g.urlPath}
          justifyContent="space-between"
          variant={selectedGuide?.urlPath === g.urlPath ? "solid" : "ghost"}
          onClick={() => {
            setSelectedGuide(g);
            if (isMobile) closeDrawer();
          }}
          px={{ base: 2, md: 2 }}
          py={{ base: 6, md: 2 }}
          fontSize={{ base: "md", md: "sm" }}
          _hover={{ bg: "gray.100" }}
        >
          <HStack spacing={2} justify={"left"} flex={1} overflow={"hidden"}>
            {isMobile ? (
              <Article fontSize="medium" />
            ) : (
              <Article fontSize="small" />
            )}
            <Text fontSize={[]}>{g.title}</Text>
          </HStack>
          {readGuides[g.urlPath] && (
            <CheckCircleIcon
              style={{
                color: "#07ad4c",
                background:
                  selectedGuide?.urlPath === g.urlPath ? "#fff" : "transparent",
                borderRadius: "50%",
              }}
            />
          )}
        </Button>
      ))}
    </VStack>
  );

  return (
    <>
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          isOpen={isDrawerOpen}
          placement="left"
          onClose={closeDrawer}
          size="xs"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody px={4}>
              <VStack align={"top"} spacing={0} my={3}>
                <Text fontSize="xl" fontWeight="bold">
                    Guide List
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  mb={4}
                >
                  ({Object.values(readGuides).filter(Boolean).length} of{" "}
                  {guideList.length} guides completed)
                </Text>
                {SidebarList}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent maxH="90vh" maxW="90vw" minH={"80vh"} minW="80vw">
          <ModalCloseButton />

          <ModalBody p={0} display="flex" flexDirection="column" bg={bg}>
            {/* Header */}
            <HStack
              px={4}
              py={3}
              bg={bg}
              borderBottom="1px solid"
              borderColor="gray.200"
              justify={"left"}
            >
              {isMobile && (
                <IconButton
                  aria-label="Open guide list"
                  icon={<Menu />}
                  onClick={openDrawer}
                  size="md"
                  variant="outline"
                />
              )}
              {iconImageUrl && (
                <Image src={iconImageUrl} boxSize="40px" alt="Tool icon" />
              )}
              <Text fontSize="xl" fontWeight="bold">
                Tool Guide
              </Text>
              <Text
                fontSize="sm"
                color="gray.500"
                display={{ base: "none", md: "block" }}
              >
                ({Object.values(readGuides).filter(Boolean).length} of{" "}
                {guideList.length} guides completed)
              </Text>
            </HStack>

            <Flex flex="1" overflow="hidden">
              {/* Desktop sidebar */}
              {!isMobile && (
                <Box
                  w={sideW}
                  borderRight="1px solid"
                  borderColor="gray.200"
                  overflowY="auto"
                  p={4}
                >
                  {SidebarList}
                </Box>
              )}

              {/* Main content */}
              <Box w={mainW} display="flex" flexDirection="column" flex="1">
                {guideHTML && !guideList.length ? (
                  <Box p={4} overflowY="auto" flex="1">
                    <div
                      dangerouslySetInnerHTML={{ __html: guideHTML || "" }}
                    />
                  </Box>
                ) : selectedGuide ? (
                  <>
                    {/* PDF scroll container */}
                    <Box
                      flex="1"
                      overflowY="auto"
                      position="relative"
                      bg={pdfBg}
                    >
                      {pdfLoading && (
                        <Flex
                          position="absolute"
                          inset="0"
                          align="center"
                          justify="center"
                          bg={pdfBg}
                          zIndex={1}
                        >
                          <Spinner size="lg" />
                        </Flex>
                      )}
                      <embed
                        src={`${selectedGuide.urlPath}#toolbar=0&navpanes=0&scrollbar=0`}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                        onLoad={() => setPdfLoading(false)}
                        aria-label={`Guide PDF: ${selectedGuide.title}`}
                      />
                    </Box>

                    {/* Sticky footer nav */}
                    <Flex
                      px={{ base: 4, md: 6 }}
                      py={{ base: 3, md: 4 }}
                      bg={bg}
                      borderTop="1px solid"
                      borderColor="gray.200"
                      position="sticky"
                      bottom={0}
                      align="center"
                      justify="space-between"
                      minH="48px"
                    >
                      <Button
                        onClick={handlePrev}
                        isDisabled={currentIndex <= 0}
                        px={{ base: 4, md: 3 }}
                        py={{ base: 3, md: 2 }}
                      >
                        Previous
                      </Button>

                      <ChakraCheckbox
                        isChecked={!!readGuides[selectedGuide.urlPath]}
                        onChange={(e) =>
                          setReadGuides((p) => ({
                            ...p,
                            [selectedGuide.urlPath]: e.target.checked,
                          }))
                        }
                        fontSize={{ base: "md", md: "sm" }}
                      >
                        Mark as read
                      </ChakraCheckbox>

                      <Button
                        onClick={handleNext}
                        isDisabled={currentIndex >= guideList.length - 1}
                        px={{ base: 4, md: 3 }}
                        py={{ base: 3, md: 2 }}
                      >
                        Next
                      </Button>
                    </Flex>
                  </>
                ) : (
                  <Flex flex="1" align="center" justify="center">
                    <Spinner size="lg" />
                  </Flex>
                )}
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

// src/components/QuickScheduleSetupModal.tsx

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
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  HStack,
  useBreakpointValue,
  useColorModeValue,
  IconButton,
  Alert,
  AlertIcon,
  Badge,
} from "@chakra-ui/react";
import { Lock, Menu } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { ScheduleType, QuickSchedule, EmailSchedule } from "@/types/schedules";
import EmailSchedulePanel from "./EmailSchedulePanel";
import { useUser } from "@/providers/UserProvider";

type QuickScheduleSetupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  toolId: number;
  customerId: number;
  isFree: boolean;
};

export default function QuickScheduleSetupModal({
  isOpen,
  onClose,
  toolId,
  customerId,
  isFree,
}: QuickScheduleSetupModalProps) {
  const {
    isOpen: isDrawerOpen,
    onOpen,
    onClose: closeDrawer,
  } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bg = useColorModeValue("white", "gray.800");
  const user = useUser();

  // 1) State to hold schedules fetched from the API
  const [localSchedules, setLocalSchedules] = useState<QuickSchedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 2) Group schedules by type
  const [groupedSchedules, setGroupedSchedules] = useState<
    Record<ScheduleType, QuickSchedule[]>
  >({ email: [] });

  // 3) The currently selected schedule (or null if none selected)
  const [selectedSchedule, setSelectedSchedule] =
    useState<QuickSchedule | null>(null);

  // 4) Helper: derive timeOfDay
  const deriveTimeOfDay = (
    sendTime: string
  ): "morning" | "afternoon" | "evening" => {
    const hour = parseInt(sendTime.split(":")[0], 10);
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  // 5) Fetch schedules using subscriptionType="view"
  const fetchSchedules = useCallback(async () => {
    setLoadingSchedules(true);
    setFetchError(null);

    console.log("Modal: fetching schedules...", { customerId, toolId });

    try {
      const response = await fetch("/api/quickSchedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          toolId,
          subscriptionType: "view",
          singleToolSched: toolId,
        }),
      });

      console.log("→ API responded with status:", response.status);

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        const message = errorJson?.error || "Unknown error fetching schedules";
        console.error("→ API fetch error:", message);
        setFetchError(message);
        setLocalSchedules([]);
      } else {
        const data = await response.json();
        console.log("→ Raw payload:", data);

        // Now pull from data.schedules.resource[0].schedule_status
        const container = data.schedules;
        const resourceArray = Array.isArray(container?.resource)
          ? container.resource
          : [];
        if (resourceArray.length === 0) {
          console.warn("→ No resource array returned from API");
          setLocalSchedules([]);
        } else {
          const scheduleStatusString = resourceArray[0].schedule_status;
          let parsedSchedules: QuickSchedule[] = [];
          try {
            parsedSchedules = JSON.parse(scheduleStatusString);
          } catch (parseErr) {
            console.error("⚠️ Error parsing schedule_status JSON:", parseErr);
            setFetchError("Failed to parse schedule data");
            setLocalSchedules([]);
            setLoadingSchedules(false);
            return;
          }

          console.log("→ Parsed schedules:", parsedSchedules);
          setLocalSchedules(parsedSchedules);
        }
      }
    } catch (err: any) {
      console.error("→ Fetch exception:", err);
      setFetchError("Network error while fetching schedules");
      setLocalSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchSchedules();
    }
  }, [isOpen, fetchSchedules]);

  // 6) Regroup whenever localSchedules changes
  useEffect(() => {
    const grouped = (localSchedules ?? []).reduce(
      (acc, sched) => {
        acc[sched.type] = acc[sched.type] || [];
        acc[sched.type].push(sched);
        return acc;
      },
      {} as Record<ScheduleType, QuickSchedule[]>
    );

    setGroupedSchedules(grouped);

    if (localSchedules && localSchedules.length > 0) {
      const stillExists =
        selectedSchedule &&
        localSchedules.find(
          (s) => s.scheduleId === selectedSchedule.scheduleId
        );
      if (stillExists) {
        setSelectedSchedule(stillExists);
      } else {
        setSelectedSchedule(localSchedules[0]);
      }
    } else {
      setSelectedSchedule(null);
    }
  }, [localSchedules]);

  // 7) When a schedule updates, update localSchedules so changes persist
  const handleUpdateSchedule = (updated: EmailSchedule) => {
    setLocalSchedules((prev) =>
      prev.map((s) => (s.scheduleId === updated.scheduleId ? updated : s))
    );
  };

  if (toolId == null) {
    return;
  }

  // 8) Sidebar JSX
  const SidebarList = (
    <VStack align="stretch" spacing={4}>
      {Object.entries(groupedSchedules).map(([type, items]) => (
        <Box key={type}>
          <Text
            fontWeight="bold"
            fontSize="md"
            mb={2}
            textTransform="capitalize"
          >
            Emails
          </Text>
          {items.map((sched) => {
            const isLocked = isFree && sched.subscriptionType === "paid";

            return (
              <Box
                key={sched.scheduleId}
                position="relative"
                border="1px solid"
                borderColor={
                  selectedSchedule?.scheduleId === sched.scheduleId
                    ? "blue.400"
                    : "gray.200"
                }
                borderRadius="md"
                p={3}
                mb={2}
                opacity={isLocked ? 0.5 : 1} // grey out if locked
                pointerEvents={isLocked ? "none" : "auto"} // prevent clicks if locked
                _hover={{
                  cursor: isLocked ? "not-allowed" : "pointer",
                  bg: isLocked ? undefined : "gray.50",
                }}
                onClick={() => {
                  if (
                    (sched.subscriptionType === "free" && isFree) ||
                    !isFree
                  ) {
                    setSelectedSchedule(sched);
                    if (isMobile) closeDrawer();
                  }
                }}
              >
                {isLocked && (
                  <Lock
                    fontSize="small"
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      color: "gray.900",
                    }}
                  />
                )}

                <Box
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg={sched.isActive ? "green.400" : "gray.400"}
                  position="absolute"
                  top="8px"
                  right="8px"
                  sx={
                    sched.isActive
                      ? {
                          animation: "pulseGreen 1.2s infinite",
                          "@keyframes pulseGreen": {
                            "0%": {
                              boxShadow: "0 0 0 0 rgba(72,187,120, 0.7)",
                            },
                            "70%": {
                              boxShadow: "0 0 0 8px rgba(72,187,120, 0)",
                            },
                            "100%": {
                              boxShadow: "0 0 0 0 rgba(72,187,120, 0)",
                            },
                          },
                        }
                      : {}
                  }
                />

                <Text fontWeight="semibold">{sched.name}</Text>

                <Text fontSize="sm" color="gray.500">
                  {(() => {
                    const getWeekdayName = (dayNum: number) =>
                      [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ][(dayNum - 1 + 7) % 7];

                    if (sched.frequency === "daily") {
                      return `Every day at ${sched.sendTime}`;
                    } else if (
                      sched.frequency === "weekly" &&
                      sched.daysOfWeek !== undefined
                    ) {
                      const days = Array.isArray(sched.daysOfWeek)
                        ? sched.daysOfWeek
                        : [sched.daysOfWeek];
                      return `Every ${days.map(getWeekdayName).join(", ")} at ${sched.sendTime}`;
                    } else if (
                      sched.frequency === "monthly" &&
                      sched.daysOfWeek !== undefined
                    ) {
                      const days = Array.isArray(sched.daysOfWeek)
                        ? sched.daysOfWeek
                        : [sched.daysOfWeek];
                      return `Every month on a ${days.map(getWeekdayName).join(", ")} at ${sched.sendTime}`;
                    } else {
                      return `${sched.frequency} at ${sched.sendTime}`;
                    }
                  })()}
                </Text>

                {sched.type === "email" && "userDistGroupNames" in sched && (
                  <Text fontSize="sm" color="gray.600">
                    Groups: {(sched.userDistGroupNames || []).join(", ")}
                  </Text>
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </VStack>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer isOpen={isDrawerOpen} placement="left" onClose={closeDrawer}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody p={4}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Quick Schedule Setup
              </Text>
              {loadingSchedules ? (
                <VStack spacing={4} align="center" mt={10}>
                  <Spinner size="lg" />
                  <Text>Loading schedules...</Text>
                </VStack>
              ) : fetchError ? (
                <Alert status="error">
                  <AlertIcon />
                  {fetchError}
                </Alert>
              ) : (
                SidebarList
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      {/* Main Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent maxW="90vw" maxH="90vh">
          <ModalCloseButton />
          <ModalBody
            p={0}
            bg={bg}
            display="flex"
            flexDirection="column"
            borderRadius={"md"}
          >
            {/* Header */}
            <HStack
              px={4}
              py={3}
              bg={bg}
              borderBottom="1px solid"
              borderColor="gray.200"
              justify="left"
              borderRadius={"md"}
            >
              {isMobile && (
                <IconButton
                  aria-label="Open schedule list"
                  icon={<Menu />}
                  onClick={onOpen}
                  size="md"
                  variant="outline"
                />
              )}
              <Text fontSize="xl" fontWeight="bold">
                Quick Schedule Setup
              </Text>
              {loadingSchedules ? (
                <Spinner size="sm" ml={2} />
              ) : (
                <Text fontSize="sm" color="gray.500" ml={2}>
                  {localSchedules ? localSchedules.length : 0} total
                </Text>
              )}
            </HStack>

            <Box display="flex" flex="1" overflow="hidden" w="100%">
              {/* Sidebar (desktop) */}
              {!isMobile && (
                <Box
                  width="30%"
                  borderRight="1px solid"
                  borderColor="gray.200"
                  p={4}
                  overflowY="auto"
                >
                  {loadingSchedules ? (
                    <VStack spacing={4} align="center" mt={10}>
                      <Spinner size="lg" />
                      <Text>Loading schedules...</Text>
                    </VStack>
                  ) : fetchError ? (
                    <Alert status="error">
                      <AlertIcon />
                      {fetchError}
                    </Alert>
                  ) : (
                    SidebarList
                  )}
                </Box>
              )}

              {/* Main panel */}
              <Box
                width={isMobile ? "100%" : "70%"}
                p={4}
                overflowY="auto"
                display="flex"
                flexDirection="column"
              >
                {loadingSchedules ? (
                  <VStack spacing={4} align="center" mt={10}>
                    <Spinner size="lg" />
                    <Text>Loading schedules...</Text>
                  </VStack>
                ) : fetchError ? (
                  <Alert status="error">
                    <AlertIcon />
                    {fetchError}
                  </Alert>
                ) : !selectedSchedule ? (
                  <Box textAlign="center" mt={10}>
                    <Text>No schedules available to display.</Text>
                  </Box>
                ) : selectedSchedule.type === "email" ? (
                  <EmailSchedulePanel
                    schedule={selectedSchedule as EmailSchedule}
                    onUpdateSchedule={handleUpdateSchedule}
                    customerId={customerId}
                    toolId={toolId}
                  />
                ) : (
                  // <Box textAlign="center" mt={10}>
                  //   <Text>This schedule type is not yet supported.</Text>
                  // </Box>
                  // NOTE: we only have emails at the min
                  <EmailSchedulePanel
                    schedule={selectedSchedule as EmailSchedule}
                    onUpdateSchedule={handleUpdateSchedule}
                    customerId={customerId}
                    toolId={toolId}
                  />
                )}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

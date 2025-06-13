/**
 * QuickScheduleSetupModal
 *
 * A responsive modal for viewing / editing "quick schedules" (currently only
 * email schedules).  Responsibilities:
 *
 * 1.  Fetch schedules for the supplied customer + tool
 * 2.  Indicate which of them are still *un-viewed* for this customer
 *     – and notify the parent via `onUnviewedChange`
 * 3.  Marks all schedules shown as viewed once the modal opens
 *
 * UI notes
 * --------
 * • Drawer on mobile, sidebar on desktop
 * • Locked rows are greyed-out when the customer is on the free tier
 * • An active schedule pulses green; inactive shows red
 *
 */

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
  HStack,
  useBreakpointValue,
  useColorModeValue,
  IconButton,
  Alert,
  AlertIcon,
  Select,
  Flex,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useTheme,
  Icon
} from "@chakra-ui/react";
import { Lock, ScheduleSend, Check, Close as CloseIcon, KeyboardArrowDown } from "@mui/icons-material";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ScheduleType, QuickSchedule, EmailSchedule } from "@/types/schedules";
import EmailSchedulePanel from "./EmailSchedulePanel";

// Helper function for formatting schedule frequency
function formatFrequency(s: QuickSchedule) {
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  if (s.frequency === "daily") return `Every day at ${s.sendTime}`;

  if (s.frequency === "weekly" && s.daysOfWeek) {
    const days = Array.isArray(s.daysOfWeek) ? s.daysOfWeek : [s.daysOfWeek];
    return `Every ${days.map((d) => weekdays[(d - 1 + 7) % 7]).join(", ")} at ${s.sendTime}`;
  }

  if (s.frequency === "monthly" && s.daysOfWeek) {
    const days = Array.isArray(s.daysOfWeek) ? s.daysOfWeek : [s.daysOfWeek];
    return `Every month on a ${days.map((d) => weekdays[(d - 1 + 7) % 7]).join(", ")} at ${s.sendTime}`;
  }

  return `${s.frequency} at ${s.sendTime}`;
}

type Props = {
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
}: Props) {
  /* ─────────────────────────────── UI helpers ────────────────────────────── */

  const isMobile = useBreakpointValue({ base: true, md: false });
  const theme = useTheme()
  const bg = theme.colors.elementBG

  /* ────────────────────────────── component state ────────────────────────── */

  const [schedules, setSchedules] = useState<QuickSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [unviewedIds, setUnviewedIds] = useState<number[]>([]);
  const [selected, setSelected] = useState<QuickSchedule | null>(null);

  /* ──────────────────────────── data fetch: schedules ────────────────────── */

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/quickSchedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          toolId,
          subscriptionType: "view",
          singleToolSched: toolId,
        }),
      });
      if (!res.ok) throw new Error("quickSchedules request failed");
      const json = await res.json();

      const resourceArr = Array.isArray(json?.schedules?.resource)
        ? json.schedules.resource
        : [];
      if (!resourceArr.length) {
        setSchedules([]);
        return;
      }

      setSchedules(
        JSON.parse(resourceArr[0].schedule_status) as QuickSchedule[]
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [customerId, toolId]);

  /* ───────────────────── data fetch: "has this schedule been viewed?" ────── */

  const checkUnviewed = useCallback(async () => {
    if (!schedules.length) return;

    try {
      const results = await Promise.all(
        schedules.map(async (s) => {
          const url = `/api/emailScheduleCustomerOpt/?customerId=${customerId}&custSchedId=${s.custSchedId}&isViewed=false`;
          const r = await fetch(url, {
            headers: { "Content-Type": "application/json" },
          });
          if (!r.ok)
            throw new Error(`isViewed check failed for ${s.custSchedId}`);
          return r.json();
        })
      );

      const ids = results
        .flatMap((p) => (p?.resource as any[]) ?? [])
        .filter((row) => row.isViewed === false)
        .map((row) => row.id);

      setUnviewedIds(ids);
    } catch (err) {
      console.error("Unviewed check error:", err);
      setUnviewedIds([]);
    }
  }, [schedules, customerId]);

  /* mark everything we just found as viewed */
  const markViewed = useCallback(async () => {
    if (!unviewedIds.length) return;

    try {
      await Promise.all(
        unviewedIds.map((id) =>
          fetch(`/api/emailScheduleCustomerOpt/?custSchedId=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          })
        )
      );
      setUnviewedIds([]);
    } catch (err) {
      console.error("Mark viewed error:", err);
    }
  }, [unviewedIds]);

  /* fetch schedules whenever the modal opens */
  useEffect(() => {
    if (isOpen) fetchSchedules();
  }, [isOpen, fetchSchedules]);

  /* re-evaluate selected schedule & unviewed list after every fetch */
  useEffect(() => {
    if (!schedules.length) {
      setSelected(null);
      return;
    }

    setSelected(
      (prev) =>
        schedules.find((s) => s.scheduleId === prev?.scheduleId) ?? schedules[0]
    );
    checkUnviewed();
  }, [schedules, checkUnviewed]);

  /* mark as viewed once the list of unviewed ids stabilises (modal is open) */
  useEffect(() => {
    if (isOpen) markViewed();
  }, [isOpen, unviewedIds, markViewed]);

  const grouped = useMemo(() => {
    return schedules.reduce<Record<ScheduleType, QuickSchedule[]>>((acc, s) => {
      (acc[s.type] ??= []).push(s);
      return acc;
    }, {} as any);
  }, [schedules]);

  const ScheduleCard = (sched: QuickSchedule) => {
    const locked = isFree && sched.subscriptionType === "paid";

    return (
      <Box
        key={sched.scheduleId}
        position="relative"
        border="1px solid"
        borderColor={
          selected?.scheduleId === sched.scheduleId ? "blue.400" : "gray.200"
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
            setSelected(sched);
          }
        }}
      >
        {locked && (
          <Lock
            fontSize="small"
            style={{ position: "absolute", top: 8, left: 8, color: "gray.900" }}
          />
        )}

        <Box
          w="10px"
          h="10px"
          borderRadius="full"
          bg={sched.isActive ? "green.400" : "red.300"}
          position="absolute"
          top="8px"
          right="8px"
          sx={
            sched.isActive
              ? {
                animation: "pulseGreen 1.2s infinite",
                "@keyframes pulseGreen": {
                  "0%": { boxShadow: "0 0 0 0 rgba(72,187,120,.7)" },
                  "70%": { boxShadow: "0 0 0 8px rgba(72,187,120,0)" },
                  "100%": { boxShadow: "0 0 0 0 rgba(72,187,120,0)" },
                },
              }
              : {}
          }
        />

        <Text fontWeight="semibold">{sched.name}</Text>
        <Text fontSize="sm" color="gray.500">
          {formatFrequency(sched)}
        </Text>
        {"userDistGroupNames" in sched && (
          <Text fontSize="sm" color="gray.600">
            Groups: {(sched.userDistGroupNames || []).join(", ")}
          </Text>
        )}
      </Box>
    );
  };

  const SidebarList = (
    <Box>
      <VStack align="stretch" spacing={4} pb={4}>
        {Object.values(grouped).every((arr) => !arr.length) && (
          <Text color="gray.500" textAlign="center" mt={10}>
            No schedules available.
          </Text>
        )}

        {Object.entries(grouped).map(([, items]) => (
          <Box key="email">
            <Text fontWeight="bold" fontSize="md" mb={2}>
              Emails
            </Text>
            {items.map(ScheduleCard)}
          </Box>
        ))}
      </VStack>
    </Box>
  );

  /* ─────────────────────────────── render ───────────────────────────────── */

  if (!toolId) return null;

  return (
    <>
      {/* Main modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
        <ModalOverlay />
        <ModalContent
          maxW={["90vw", null, null, "1200px"]}
          maxH="85vh"
          minH="500px"
          borderRadius={"md"}
          overflow={"hidden"}
        >
          <ModalCloseButton />
          <ModalBody p={0} bg={bg} display="flex" flexDirection="column" flex="1" minH="0">
            <Header total={schedules.length} />

            <Box display="flex" flex="1" overflow="hidden" minH="0">
              {/* Desktop sidebar */}
              {!isMobile && (
                <Box
                  width="30%"
                  overflowY="auto"
                  minH="0"
                  css={{
                    "&::-webkit-scrollbar": { display: "none" },
                    "-ms-overflow-style": "none",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                  borderRight="1px solid"
                  borderColor="gray.200"
                  p={4}
                >
                  {loading ? (
                    <SpinnerBlock />
                  ) : error ? (
                    <ErrorAlert message={error} />
                  ) : (
                    SidebarList
                  )}
                </Box>
              )}

              {/* Main panel */}
              <Box
                width={isMobile ? "100%" : "70%"}
                p={4}
                bg="gray.200"
                overflowY="auto"
              >
                {loading ? null : error ? (
                  <ErrorAlert message={error} />
                ) : !selected ? (
                  <Text textAlign="center" mt={10}>
                    No schedules available to display.
                  </Text>
                ) : (
                  <>
                    {isMobile && schedules.length > 0 && (
                      <Box mb={4}>
                        <Menu>
                          <MenuButton as={Button} rightIcon={<KeyboardArrowDown />} width="100%" bg={theme.colors.elementBG}>
                            <HStack spacing={2} width="100%" justifyContent="space-between">
                              <Text flex="1" textAlign="left" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                {selected.name}
                              </Text>
                              {selected.isActive ? (
                                <Icon as={Check} color="green.500" />
                              ) : (
                                <Icon as={CloseIcon} color="red.500" />
                              )}
                            </HStack>
                          </MenuButton>
                          <MenuList width="100%">
                            {schedules.map((sched) => (
                              <MenuItem
                                key={sched.scheduleId}
                                onClick={() => setSelected(sched)}
                              >
                                <HStack spacing={2} width="100%" justifyContent="space-between">
                                  <Text flex="1" textAlign="left" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                    {sched.name}
                                  </Text>
                                  {sched.isActive ? (
                                    <Icon as={Check} color="green.500" />
                                  ) : (
                                    <Icon as={CloseIcon} color="red.500" />
                                  )}
                                </HStack>
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                      </Box>
                    )}
                    <EmailSchedulePanel
                      schedule={selected as EmailSchedule}
                      onUpdateSchedule={(upd) =>
                        setSchedules((prev) =>
                          prev.map((s) =>
                            s.scheduleId === upd.scheduleId ? upd : s
                          )
                        )
                      }
                      customerId={customerId}
                      toolId={toolId}
                    />
                  </>
                )}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );

  function SpinnerBlock() {
    return (
      <VStack spacing={4} align="center" mt={10}>
        <Spinner size="lg" />
        <Text>Loading schedules...</Text>
      </VStack>
    );
  }

  function ErrorAlert({ message }: { message: string }) {
    return (
      <Alert status="error">
        <AlertIcon />
        {message}
      </Alert>
    );
  }

  function Header({ total }: { total: number }) {
    return (
      <HStack
        px={4}
        py={3}
        bg={bg}
        borderBottom="1px solid"
        borderColor="gray.200"
        fontSize="28px"
        align="center"
      >
        <ScheduleSend
          fontSize="inherit"
          htmlColor="var(--chakra-colors-primary)"
        />
        <Text
          fontSize={["xl", "2xl", "3xl"]}
          fontWeight="medium"
          fontFamily="bonfire"
          mb={-3}
        >
          Quick Schedule Setup
        </Text>
        {!loading && !isMobile && (
          <Text fontSize="sm" color="gray.500" ml={2}>
            {total} total
          </Text>
        )}
      </HStack>
    );
  }
}

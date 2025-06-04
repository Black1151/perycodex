"use client";

import React, { useState, useEffect } from "react";
import {
  Flex,
  VStack,
  Text,
  Button,
  Spinner,
  useTheme,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import LogoUpload from "../LogoUpload";
import ConfettiAlt from "@/components/animations/confetti/ConfettiAlt";
import { Check } from "@mui/icons-material";
import { useFetchClient } from "@/hooks/useFetchClient";

interface RegisterSuccessProps {
  initialCustomerData: any;
}

export default function RegisterSuccess({
  initialCustomerData,
}: RegisterSuccessProps) {
  const { user } = useUser();
  const router = useRouter();
  const theme = useTheme();
  const fetchClient = useFetchClient();

  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [schedulesComplete, setSchedulesComplete] = useState(false);
  const [customerData, setCustomerData] = useState<any>(initialCustomerData);
  const [hasLogo, setHasLogo] = useState(Boolean(initialCustomerData?.custImageUrl));
  const [loading, setLoading] = useState(true); // Show loading immediately
  const [error, setError] = useState<string | null>(null);

  // 🔁 Immediately trigger router.refresh() on first render
  useEffect(() => {
    if (!hasRefreshed) {
      router.refresh();
      setHasRefreshed(true);
    }
  }, [hasRefreshed, router]);

  // 🛠 Setup schedules once user and refresh are ready
  useEffect(() => {
    if (!user || !hasRefreshed) return;

    const parsedTools = (() => {
      try {
        return typeof user.subscribedTools === "string"
          ? JSON.parse(user.subscribedTools)
          : Array.isArray(user.subscribedTools)
            ? user.subscribedTools
            : [];
      } catch (e) {
        console.error("[RegisterSuccess] ❌ Failed to parse subscribedTools:", e);
        return [];
      }
    })();

    const schedulePayloads = parsedTools.map((toolId: number) => ({
      customerId: user.customerId,
      toolId: Number(toolId),
      subscriptionType: "free",
    }));

    const setupSchedules = async () => {
      try {
        if (schedulePayloads.length === 0) {
          console.log("[RegisterSuccess] No schedules to create.");
          setSchedulesComplete(true);
          setLoading(false);
          return;
        }

        console.log("[RegisterSuccess] Creating schedule payloads:", schedulePayloads);

        const responses = await Promise.all(
          schedulePayloads.map((payload: any, idx: any) => {
            console.log(`→ POSTing schedule payload #${idx + 1}:`, payload);
            return fetchClient.fetchClient("/api/quickSchedules", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: payload,
            });
          })
        );

        const allSuccessful = responses.every((res) => res.ok);

        console.log("[RegisterSuccess] ✅ All schedules created successfully.");
        setSchedulesComplete(true);
      } catch (err: any) {
        console.error("[RegisterSuccess] ⚠️ Error setting up schedules:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    setupSchedules();
  }, [user, hasRefreshed]);

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  if (error || !customerData) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Text color="red.300">{error ?? "Unknown error"}</Text>
      </Flex>
    );
  }

  return (
    <VStack minH="100vh" w="full" p={4} spacing={8}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap={8}
        textAlign="center"
        flex={1}
      >
        <ConfettiAlt show={hasRefreshed} />

        <VStack spacing={1}>
          <Text fontFamily="bonfire" fontSize="4xl" color="white">
            Your company has been registered successfully!
          </Text>
          <Text
            fontFamily="bonfire"
            fontSize="2xl"
            fontWeight="light"
            color="white"
          >
            We’re so excited to have you on board 🎉
          </Text>
        </VStack>

        <Text color="white" fontSize="lg">
          Last Step… Upload your company logo (optional)
        </Text>

        <LogoUpload
          onUploadComplete={(url: string) => {
            console.log("[RegisterSuccess] Logo uploaded:", url);
            setHasLogo(true);
            setCustomerData((prev: any) => ({
              ...prev,
              custImageUrl: url,
            }));
          }}
        />

        <Button
          size="lg"
          bg={theme.colors.seduloGreen}
          _hover={{ bg: theme.colors.seduloGreenDark }}
          color="white"
          rightIcon={<Check />}
          onClick={() => {
            console.log(
              "[RegisterSuccess] Finished – navigating to /tool-store"
            );
            router.push("/tool-store");
          }}
        >
          Finish
        </Button>
      </Flex>
    </VStack>
  );
}

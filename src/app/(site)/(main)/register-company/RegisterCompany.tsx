"use client";

import { useState, useEffect, use } from "react";
import { Flex, VStack, Text, Button, Spinner } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { registerCustomerJson } from "@/components/surveyjs/forms/registerCompany";
import { useUser } from "@/providers/UserProvider";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import LogoUpload from "./LogoUpload";
import { cookies } from "next/headers";

export default function RegisterCompany() {
  const { user } = useUser();
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasLogo, setHasLogo] = useState(false);

  // 1️⃣ When the component mounts (and user is known), fetch customer
  useEffect(() => {
    if (!user) return;
    if (user.customerUniqueId == null) {
      setLoading(false);
      return
    }

    fetch(`/api/customer/allBy?uniqueId=${user.customerUniqueId}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load customer");
        return res.json();
      })
      .then((json) => {
        setCustomerData(json.resource);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

    if (customerData && customerData.custImageUrl) {
      setHasLogo(true);
    }
  }, [user]);

  // 2️⃣ If there's no user yet, or we're still loading, return early
  if (!user) return null;
  if (loading) {
    return (
      <Flex flex={1} align="center" justify="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // 3️⃣ If customerData exists, show the “registered” screen + upload
  if (customerData) {
    return (
      <VStack minH="100svh" width="100%" flex={1}>
        <Flex
          direction="column"
          flex={1}
          align="center"
          justify="center"
          gap={4}
        >
          <Text fontFamily="bonfire" fontSize={42} color="white">
            Your company has been registered successfully!
          </Text>
          <Text color="white" fontSize={20}>
            Last Step... Upload your company logo
          </Text>
          <LogoUpload />
          <Button
            mt={8}
            onClick={() =>
              (window.location.href = "/register-company/tool-selection")
            }
          >
            {hasLogo ? "View Your Tools" : "Continue without logo"}
          </Button>
        </Flex>
      </VStack>
    );
  }

  // 4️⃣ Otherwise, show the registration form
  return (
    <PerygonContainer>
      <Flex direction="column" flex={1}>
        <VStack pt="50px" pb={8} spacing={4} align="center">
          <LetterFlyIn fontSize={28}>Welcome to...</LetterFlyIn>
          <LetterFlyIn fontSize={90}>Perygon</LetterFlyIn>
          <LetterFlyIn fontSize={38}>
            Let’s set up your organisation
          </LetterFlyIn>
        </VStack>
        <Flex flex="1" w="100%" justify="center" align="flex-start" pb={8}>
          <AdminFormWrapper
            formJson={registerCustomerJson}
            data={{
              userEmail: user.email,
              userUniqueId: user.userUniqueId,
              userId: user.userId,
            }}
            layoutConfig={{
              layoutKey: "company-registration",
              layoutProps: {},
            }}
            globalVariables={[]}
            stylingConfig={{ sjsFilePath: "admin", cssFilePath: "" }}
            jsImport=""
            excludeKeys={["imageUrl"]}
            endpoint="/companyRegistration"
            formSuccessMessage="Your company has been registered successfully!"
            reloadPageOnSuccess={true}
            redirectUrl={null}
            isNew
            isAllowedToEdit
          />
        </Flex>
      </Flex>
    </PerygonContainer>
  );
}

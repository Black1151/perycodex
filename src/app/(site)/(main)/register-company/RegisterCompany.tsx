"use client";

import { useState, useEffect, use } from "react";
import { Flex, VStack, Text, Button, Spinner, HStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { registerCustomerJson } from "@/components/surveyjs/forms/registerCompany";
import { useUser } from "@/providers/UserProvider";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import LogoUpload from "./LogoUpload";
import { useTheme } from "@chakra-ui/react";

export default function RegisterCompany() {
  const { user } = useUser();
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasLogo, setHasLogo] = useState(false);
  const theme = useTheme();

  // 1️⃣ Fetch your customer once user is known
  useEffect(() => {
    if (!user) return;
    if (user.customerUniqueId == null) {
      setLoading(false);
      return;
    }

    fetch(`/api/customer/allBy?uniqueId=${user.customerUniqueId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load customer");
        return res.json();
      })
      .then((json) => setCustomerData(json.resource))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // 2️⃣ Whenever customerData changes, update hasLogo
  useEffect(() => {
    setHasLogo(Boolean(customerData?.custImageUrl));
  }, [customerData]);

  if (!user) return null;
  if (loading) {
    return (
      <Flex flex={1} align="center" justify="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (customerData) {
    return (
      <VStack minH="100svh" width="100%" flex={1}>
        <Flex
          direction="column"
          flex={1}
          align="center"
          justify="center"
          gap={4}
          p={[4,4,0]}
          textAlign={"center"}
        >
          <Text fontFamily="bonfire" fontSize={46} color="white">
            Your company has been registered successfully!
          </Text>
          <Text color="white" fontSize={20}>
            Last Step... Upload your company logo (optional)
          </Text>
          <LogoUpload
            onUploadComplete={(url) => {
              setHasLogo(true);
              setCustomerData((old: any) => ({ ...old, custImageUrl: url }));
            }}
          />
          <Button
            mt={8}
            onClick={() =>
              (window.location.href = "/register-company/tool-selection")
            }
          >
            Continue...
          </Button>
        </Flex>
      </VStack>
    );
  }

  // 4️⃣ Otherwise, show the registration form
  return (
    <PerygonContainer>
      <Flex direction="column" flex={1}>
        <Flex
          direction={["column", "row", "row"]}
          flex={1}
          gap={[3, 4, 8]}
          align={["center", "flex-end"]}
          pb={[2, 4]}
          justify={["center", "start"]}
          flexWrap="wrap"
          px={8}
        >
          <VStack
            pt={["10px", "30px", "50px"]}
            spacing={[1, 3, 4]}
            align={["center", "start"]}
            textAlign={["center", "left"]}
          >
            <Text fontSize={[28, 28, 32]} fontFamily={"bonfire"} color="white">
              Welcome to...
            </Text>
            <Text
              fontSize={[62, 70, 90]}
              lineHeight={1}
              fontFamily={"bonfire"}
              color="white"
            >
              Perygon
            </Text>
          </VStack>
          <Text
            fontSize={[28, 28, 32]}
            lineHeight={[1, 2]}
            fontFamily={"bonfire"}
            color="white"
            textAlign={["center", "left"]}
            mt={[1, 0]}
          >
            Let’s set up your organisation
          </Text>
        </Flex>
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

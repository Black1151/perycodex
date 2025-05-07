"use client";

import React, { useState, useEffect } from "react";
import {
  Flex,
  VStack,
  Text,
  Button,
  useTheme,
} from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { useUser } from "@/providers/UserProvider";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import LogoUpload from "./LogoUpload";

interface RegisterCompanyProps {
  registerCustomerJson: any;
  initialCustomerData: any;
}

export default function RegisterCompany({
  registerCustomerJson,
  initialCustomerData,
}: RegisterCompanyProps) {
  const { user } = useUser();

  const [customerData, setCustomerData] = useState<any>(initialCustomerData);
  const [hasLogo, setHasLogo] = useState<boolean>(Boolean(initialCustomerData?.custImageUrl));
  const theme = useTheme();

  useEffect(() => {
    setHasLogo(Boolean(customerData?.custImageUrl));
  }, [customerData]);

  if (!user) return null;

  // If already registered, skip the form
  if (customerData) {
    return (
      <VStack minH="100svh" width="100%" flex={1}>
        <Flex
          direction="column"
          flex={1}
          align="center"
          justify="center"
          gap={4}
          p={[4, 4, 0]}
          textAlign="center"
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
              setCustomerData((old: any) => ({
                ...old,
                custImageUrl: url,
              }));
            }}
          />
          <Button
            mt={8}
            onClick={() =>
              (window.location.href = "/tool-store")
            }
          >
            Continue...
          </Button>
        </Flex>
      </VStack>
    );
  }

  // Otherwise, show the registration form
  return (
    <PerygonContainer>
      <Flex direction="column" flex={1} maxW={1200}>
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
            <Text fontSize={[28, 28, 32]} fontFamily="bonfire" color="white">
              Welcome to...
            </Text>
            <Text
              fontSize={[62, 70, 90]}
              lineHeight={1}
              fontFamily="bonfire"
              color="white"
            >
              Perygon
            </Text>
          </VStack>
          <Text
            fontSize={[28, 28, 32]}
            lineHeight={[1, 2]}
            fontFamily="bonfire"
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

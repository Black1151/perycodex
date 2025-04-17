"use client";

import { Flex, VStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { registerCustomerJson } from "@/components/surveyjs/forms/registerCompany";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function RegisterCompany() {
  const handleSurveySuccess = (surveyData: any) => {
    console.log("Survey submitted successfully!");
    console.log("Survey Data:", surveyData);
  }

  return (
    <PerygonContainer>
      {/* A column‑flex that is the full viewport height */}
      <Flex direction="column" minH="100vh">
        {/* ── HEADER ────────────────────────────────────── */}
        <VStack pt="50px" pb={8} spacing={4} align="center">
          <LetterFlyIn fontSize={90}>Perygon</LetterFlyIn>
          <LetterFlyIn fontSize={38}>Let’s set up your organisation</LetterFlyIn>
        </VStack>

        {/* ── FORM WRAPPER ─────────────────────────────── */}
        <Flex
          flex="1"          /* ← fills all remaining height */
          w="100%"
          justify="center" /* optional – centres horizontally */
          align="flex-start"
          px={4}
        >
          <AdminFormWrapper
            formJson={registerCustomerJson}
            data={null}
            layoutConfig={{ layoutKey: "company-registration", layoutProps: {} }}
            globalVariables={[]}
            stylingConfig={{ sjsFilePath: "admin", cssFilePath: "admin" }}
            jsImport=""
            excludeKeys={["imageUrl"]}
            endpoint="/companyRegistration"
            formSuccessMessage={null}
            reloadPageOnSuccess={false}
            redirectUrl="/"
            isNew
            isAllowedToEdit
          />
        </Flex>
      </Flex>
    </PerygonContainer>
  );
}

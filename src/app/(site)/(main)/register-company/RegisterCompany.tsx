"use client";

import { Flex, VStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { registerCustomerJson } from "@/components/surveyjs/forms/registerCompany";
import { useUser } from "@/providers/UserProvider";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FormComponent } from "@/components/surveyjs/FormComponent";
import useFormNavigation from "@/components/surveyjs/hooks/useFormNavigation";

const AdminFormWrapper = dynamic(
  () => import("@/components/surveyjs/AdminFormWrapper"),
  { ssr: false }
);
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

export default function RegisterCompany() {
  const { user } = useUser();
  if (!user) {
    return null; // or a loading state, or redirect to login
  }

  const userEmail = user.email;
  console.log("User email:", userEmail); // Log the user email to the console

  const userUniqueId = user.userUniqueId;
  console.log("User unique ID:", userUniqueId); // Log the user unique ID to the console

  return (
    <PerygonContainer>
      {/* A column‑flex that is the full viewport height */}
      <Flex direction="column" minH="100vh">
        {/* ── HEADER ────────────────────────────────────── */}
        <VStack pt="50px" pb={8} spacing={4} align="center">
          <LetterFlyIn fontSize={90}>Perygon</LetterFlyIn>
          <LetterFlyIn fontSize={38}>
            Let’s set up your organisation
          </LetterFlyIn>
        </VStack>

        {/* ── FORM WRAPPER ─────────────────────────────── */}
        <Flex
          flex="1" /* ← fills all remaining height */
          w="100%"
          justify="center" /* optional – centres horizontally */
          align="flex-start"
          px={4}
        >
          <AdminFormWrapper
            formJson={registerCustomerJson}
            data={{userEmail, userUniqueId}}
            layoutConfig={{ layoutKey: "company-registration", layoutProps: {} }}
            globalVariables={[]}
            stylingConfig={{ sjsFilePath: "admin", cssFilePath: "" }}
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

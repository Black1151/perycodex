import { Center, VStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { LoginCard } from "../../components/login/LoginCard";
import { ProfileCompletionForm } from "@/components/forms/ProfileCompletionForm";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // Force dynamic rendering - used as apparently cant fetch cookies in the page and have it render statically. Does not seem to be an issue when getting the cookies in a server route but calling a server route from a server page seemed to cause issues. - TODO look into more and find a way to preserve static rendering

const typesArray = ["job_level", "job_type", "title", "team", "dept"];

export default async function ProfileSetup() {
  let apiResponse;

  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    const response = await fetch(`${process.env.BE_URL}/selectItem/allBy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ type: typesArray }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile setup data");
    }

    const data = await response.json();
    apiResponse = data.resource;
  } catch (error: any) {
    console.error("Error fetching profile setup data:", error);
  }

  return (
    <PerygonContainer>
      <Center flex={1}>
        <LoginCard
          height={1500}
          imageOffset={-1150}
          titleComponent={
            <VStack position="absolute" top="100px">
              <LetterFlyIn fontSize={90}>Perygon</LetterFlyIn>
              <LetterFlyIn fontSize={32}>
                Please set up your profile
              </LetterFlyIn>
              <LetterFlyIn fontSize={22}>Then you are all done!</LetterFlyIn>
            </VStack>
          }
        >
          <ProfileCompletionForm
            isSubmitting={false}
            errors={{}}
            dropdowns={apiResponse}
          />
        </LoginCard>
      </Center>
    </PerygonContainer>
  );
}

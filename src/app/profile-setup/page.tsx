import { Center, VStack, Text } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { LoginCard } from "../../components/login/LoginCard";
import { ProfileCompletionForm } from "@/components/forms/ProfileCompletionForm";
import { cookies } from "next/headers";
import { DropdownOption } from "@/components/forms/InputField";
import { transformTeams } from "../api/selectItems/fetchTeamsSelectItems/transformTeams";

export const dynamic = "force-dynamic"; // Ensures dynamic rendering due to the use of cookies

const typesArray = ["job_level", "job_type", "title", "team", "dept"];

export default async function ProfileSetup() {
  let dropdowns;
  let departments;
  let sites;

  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    const fetchDropdowns = fetch(`${process.env.BE_URL}/selectItem/allBy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ type: typesArray }),
    });

    const fetchDepartments = fetch(
      `${process.env.BE_URL}/userTeam/allBy?selectColumns=id,name&parentTeamId=null`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const fetchSites = fetch(
      `${process.env.BE_URL}/site/allBy?selectColumns=id,site_name`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const [
      fetchDropdownsResponse,
      fetchDepartmentsResponse,
      fetchSitesResponse,
    ] = await Promise.all([fetchDropdowns, fetchDepartments, fetchSites]);
    const dropdownsData = await fetchDropdownsResponse.json();
    const departmentsData = await fetchDepartmentsResponse.json();
    const sitesData = await fetchSitesResponse.json();

    //// conversion of data to correct shape for dropdown  - consider handling on the backend

    type SiteFromBE = {
      id: number;
      siteName: string;
    };

    const transformSites = (sites: SiteFromBE[]): DropdownOption[] => {
      return sites.map((site) => ({
        value: site.id,
        label: site.siteName,
      }));
    };

    dropdowns = dropdownsData.resource;
    departments = transformTeams(departmentsData.resource.userTeams);
    sites = transformSites(sitesData.resource.sites);
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
            <VStack position="absolute" top="60px">
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
            dropdowns={dropdowns}
            departmentsDropdown={departments || []}
            sitesDropdown={sites || []}
          />
        </LoginCard>
      </Center>
    </PerygonContainer>
  );
}

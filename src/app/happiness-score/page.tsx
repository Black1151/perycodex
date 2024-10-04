import { cookies } from "next/headers";
import { NavBarProps } from "../NavBar";
import HappinessScoreClientInner from "./HappinessScoreClientInner";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;
  const authToken = cookieStore.get("auth_token")?.value;

  let userIdentity = null;
  let toolsList = null;

  if (uniqueId && authToken) {
    try {
      const [identityResponse, toolsResponse] = await Promise.all([
        fetch(
          `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=userImageUrl,firstName,role`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        ),
        fetch(`${process.env.BE_URL}/getAllView?view=vwToolsList`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      ]);

      const identityData = await identityResponse.json();
      const toolsData = await toolsResponse.json();

      userIdentity = identityData.resource;
      toolsList = toolsData.resource;
    } catch (error) {
      redirect("/error");
    }
  }

  const navBarProps: NavBarProps = {
    userFirstName: userIdentity?.firstName,
    userImageUrl: userIdentity?.userImageUrl,
    userRole: userIdentity?.role,
  };

  return <HappinessScoreClientInner navBarProps={navBarProps} />;
}

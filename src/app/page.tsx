import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HomePage from "./HomePage";
import { NavBarProps } from "./NavBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;
  const authToken = cookieStore.get("auth_token")?.value;

  let isProfileRegistered = false;
  let userIdentity = null;
  let toolsList = null;

  if (uniqueId && authToken) {
    try {
      const [profileResponse, identityResponse, toolsResponse] =
        await Promise.all([
          // Fetch profile registration status
          fetch(`${process.env.BE_URL}/user/isProfileComplete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ uniqueId }),
          }),

          // Fetch user identity
          fetch(
            `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=userImageUrl,firstName,role`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          ),

          // Fetch tools list
          fetch(`${process.env.BE_URL}/getAllView?view=vwToolsList`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
        ]);

      const profileData = await profileResponse.json();
      const identityData = await identityResponse.json();
      const toolsData = await toolsResponse.json();

      isProfileRegistered = profileData.resource.isProfileRegistered;
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

  if (isProfileRegistered === false) {
    return redirect("/profile-setup");
  }

  return <HomePage navBarProps={navBarProps} toolsList={toolsList} />;
}

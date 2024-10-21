import { NavBarProps } from "@/app/NavBar";
import { UserIdentity, Tool } from "@/types/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function MainPage<T extends Tool>({
  searchParams,
  toolId,
  ClientInnerComponent,
  children,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  toolId: string;

  ClientInnerComponent?: React.ComponentType<{
    navBarProps: NavBarProps;
    toolData: T;
  }>;
  children?: ReactNode;
}) {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;
  const authToken = cookieStore.get("auth_token")?.value;

  let isProfileRegistered = false;
  let userIdentity: UserIdentity | null = null;
  let toolData: T | null = null;

  if (uniqueId && authToken) {
    try {
      const [profileResponse, identityResponse, toolDataResponse] =
        await Promise.all([
          fetch(`${process.env.BE_URL}/user/isProfileComplete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ uniqueId }),
          }),
          fetch(
            `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=userImageUrl,firstName,role`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          ),
          fetch(
            `${process.env.BE_URL}/getView?view=vwToolsWorkflowList&toolId=${toolId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          ),
        ]);

      const profileData = await profileResponse.json();
      const identityData = await identityResponse.json();
      const toolDataData = await toolDataResponse.json();

      isProfileRegistered = profileData.resource.isProfileRegistered;
      userIdentity = identityData.resource as UserIdentity;
      toolData = toolDataData.resource as T;
    } catch (error) {
      console.error(error);
      redirect("/login");
    }
  }

  const navBarProps = {
    userFirstName: userIdentity?.firstName ?? "",
    userImageUrl: userIdentity?.userImageUrl ?? "",
    userRole: userIdentity?.role ?? "",
    logoImageUrl: toolData?.logoImageUrl ?? "",
  };

  if (!isProfileRegistered) {
    return redirect("/profile-setup");
  }

  if (ClientInnerComponent && toolData) {
    return (
      <ClientInnerComponent navBarProps={navBarProps} toolData={toolData} />
    );
  }

  return <>{children}</>;
}

import React, { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { NavBar } from "../NavBar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SiteProviders from "./SiteProviders";
import { UserContextProps } from "@/providers/UserProvider";
import apiClient from "@/lib/apiClient";

interface NavBarProps {
  userFirstName: string;
  userImageUrl: string;
  userRole: string;
  userCustomerId: string;
  logoImageUrl?: string;
}

export const dynamic = "force-dynamic";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const uniqueId = cookieStore.get("user_uuid")?.value;

  if (!authToken) {
    redirect("/login");
  }

  let navBarProps = {
    userFirstName: "",
    userImageUrl: "",
    userRole: "",
    userCustomerId: "",
  };

  let userMetadata = {};

  try {
    const [fetchUserInfo, fetchUserMetadata] = await Promise.all([
      apiClient(
        `/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=userImageUrl,firstName,role,customerId`,
        { cache: "no-store" }
      ),
      apiClient(`/getUserMetadata`, {
        method: "POST",
        body: JSON.stringify({ p_userUniqueId: uniqueId }),
        cache: "no-store",
      }),
    ]);

    const userInfoData = await fetchUserInfo.json();
    const userMetadataData = await fetchUserMetadata.json();

    navBarProps = {
      userFirstName: userInfoData.resource.firstName,
      userImageUrl: userInfoData.resource.userImageUrl,
      userRole: userInfoData.resource.role,
      userCustomerId: userInfoData.resource.customerId,
    };

    userMetadata = userMetadataData.resource;
  } catch (error: any) {
    console.error("Error details:", error);
    redirect("/error");
  }

  return (
    <SiteProviders userMetadata={userMetadata as UserContextProps}>
      <PerygonContainer>
        <NavBar {...(navBarProps as NavBarProps)} />
        {children}
      </PerygonContainer>
      <Footer />
    </SiteProviders>
  );
}

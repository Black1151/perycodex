import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import { cookies } from "next/headers";
import { PerygonMainClient } from "./PerygonMainClient";
import { redirect } from "next/navigation";

type CarouselItemWithoutIsSelected = Omit<CarouselItemProps, "isSelected">;

function transformCarouselItems(data: any[]): CarouselItemWithoutIsSelected[] {
  return data.map((item) => ({
    logoImage: item.logoImageUrl,
    backgroundImage: item.previewImageUrl,
    alt: item.displayName,
    name: item.displayName,
    description: item.previewText,
    appUrl: "/happiness-score",
  }));
}

export default async function PerygonMain() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const uniqueId = cookieStore.get("user_uuid")?.value;

  let carouselItems: CarouselItemWithoutIsSelected[] = [];
  let navbarProps = {
    userFirstName: "",
    userImageUrl: "",
    userRole: "",
  };

  if (authToken) {
    try {
      const [fetchCarouselItems, fetchUserInfo, fetchProfileStatus] =
        await Promise.all([
          fetch(`${process.env.BE_URL}/getAllView?view=vwToolsCarouselList`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
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
          fetch(`${process.env.BE_URL}/user/isProfileComplete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ uniqueId }),
          }),
        ]);

      if (
        !fetchCarouselItems.ok ||
        !fetchUserInfo.ok ||
        !fetchProfileStatus.ok
      ) {
        throw new Error("Failed to fetch data: Non-OK response");
      }

      const carouselItemsData = await fetchCarouselItems.json();
      const userInfoData = await fetchUserInfo.json();
      const profileStatusData = await fetchProfileStatus.json();

      if (!profileStatusData.resource.isProfileRegistered) {
        redirect("/profile-setup");
      }

      carouselItems = transformCarouselItems(carouselItemsData.resource);

      navbarProps = {
        userFirstName: userInfoData.resource.firstName,
        userImageUrl: userInfoData.resource.profilePictureUrl,
        userRole: userInfoData.resource.role,
      };
    } catch (error: any) {
      console.error("Error details:", error);
      redirect("/error");
    }
  } else {
    redirect("/login");
  }

  return (
    <>
      <PerygonMainClient
        navbarProps={navbarProps}
        carouselItems={carouselItems}
      />
    </>
  );
}

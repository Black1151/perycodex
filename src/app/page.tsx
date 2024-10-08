import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import { cookies } from "next/headers";
import { PerygonMainClient } from "./PerygonMainClient";
import { redirect } from "next/navigation";

type CarouselItemWithoutIsSelected = Omit<CarouselItemProps, "isSelected">;

function transformCarouselItems(data: any[]): CarouselItemWithoutIsSelected[] {
  return data.map((item) => ({
    logoImage: item.logoImageUrl,
    iconImage: item.iconImageUrl,
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
  let isProfileRegistered = false;

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

      const carouselItemsData = await fetchCarouselItems.json();
      const userInfoData = await fetchUserInfo.json();
      const profileStatusData = await fetchProfileStatus.json();

      carouselItems = transformCarouselItems(carouselItemsData.resource);

      console.log(carouselItems);

      navbarProps = {
        userFirstName: userInfoData.resource.firstName,
        userImageUrl: userInfoData.resource.profilePictureUrl,
        userRole: userInfoData.resource.role,
      };

      isProfileRegistered = profileStatusData.resource.isProfileRegistered;
    } catch (error: any) {
      console.error("Error details:", error);
      redirect("/error");
    }
  } else {
    redirect("/login");
  }

  if (isProfileRegistered === false) {
    return redirect("/profile-setup");
  }

  return (
    <PerygonMainClient
      navbarProps={navbarProps}
      carouselItems={carouselItems}
    />
  );
}

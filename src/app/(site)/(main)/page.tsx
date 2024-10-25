// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";

import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import { cookies } from "next/headers";
import { PerygonMainClient } from "../../PerygonMainClient";
import { redirect } from "next/navigation";

type CarouselItemWithoutIsSelected = Omit<CarouselItemProps, "isSelected">;

function transformCarouselItems(data: any[]): CarouselItemWithoutIsSelected[] {
  return data.map((item) => ({
    toolId: item.toolId,
    logoImage: item.logoImageUrl,
    iconImage: item.iconImageUrl,
    thumbNailImage: item.thumbnailImageUrl,
    backgroundImage: item.previewImageUrl,
    alt: item.displayName,
    name: item.displayName,
    description: item.previewText,
    appUrl: item.appUrl,
  }));
}

export default async function PerygonMain() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const uniqueId = cookieStore.get("user_uuid")?.value;

  let carouselItems: CarouselItemWithoutIsSelected[] = [];
  let isProfileRegistered = false;

  if (authToken) {
    try {
      const [fetchCarouselItems, fetchProfileStatus] = await Promise.all([
        fetch(`${process.env.BE_URL}/getAllView?view=vwToolsCarouselList`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          cache: "no-store",
          next: { revalidate: 0 },
        }),
        fetch(`${process.env.BE_URL}/user/isProfileComplete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ uniqueId }),
          cache: "no-store",
          next: { revalidate: 0 },
        }),
      ]);

      const carouselItemsData = await fetchCarouselItems.json();
      const profileStatusData = await fetchProfileStatus.json();

      carouselItems = transformCarouselItems(carouselItemsData.resource ?? []);
      isProfileRegistered = profileStatusData.resource.isProfileRegistered;
    } catch (error: any) {
      console.error("Error details:", error);
      redirect("/error");
    }
  } else {
    redirect("/login");
  }

  if (!isProfileRegistered) {
    return redirect("/profile-setup");
  }

  if (carouselItems.length === 1) {
    return redirect(
      `${carouselItems[0].appUrl}?toolId=${carouselItems[0].toolId}`
    );
  }

  return (
    <PerygonMainClient
      carouselItems={carouselItems}
      showNoToolsModal={carouselItems.length === 0}
    />
  );
}

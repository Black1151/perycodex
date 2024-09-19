import { cookies } from "next/headers";
import HomePage from "./HomePage";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;
  const authToken = cookieStore.get("auth_token")?.value;

  let isProfileRegistered = false;

  if (uniqueId && authToken) {
    try {
      const response = await fetch(
        `${process.env.BE_URL}/user/isProfileComplete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ uniqueId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile registration status");
      }
      const data = await response.json();
      isProfileRegistered = data.resource.isProfileRegistered;
    } catch (error) {
      console.error("Error checking profile status:", error);
    }
  }

  if (isProfileRegistered === false) {
    return redirect("/profile-setup");
  }

  return <HomePage />;
}

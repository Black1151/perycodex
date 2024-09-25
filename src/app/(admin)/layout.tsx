import { ReactNode } from "react"; // Import ReactNode
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/app/(admin)/AdminLayout";
import { NavBarProps } from "@/app/NavBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// Define props type with children
interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;
  const authToken = cookieStore.get("auth_token")?.value;

  if (!uniqueId || !authToken) {
    return redirect("/login");
  }

  // Fetch user data
  let userIdentity = null;

  try {
    const [identityResponse] = await Promise.all([
      fetch(
        `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=userImageUrl,firstName,role`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      ),
    ]);

    userIdentity = (await identityResponse.json()).resource;
  } catch (error) {
    redirect("/error");
  }

  const navBarProps: NavBarProps = {
    userFirstName: userIdentity?.firstName,
    userImageUrl: userIdentity?.userImageUrl,
    userRole: userIdentity?.role,
  };

  return (
    <AdminLayout navBarProps={navBarProps}>
      {/* Page-specific content */}
      {children}
    </AdminLayout>
  );
}

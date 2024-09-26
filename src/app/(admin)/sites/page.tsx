import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { siteFields } from "@/components/agGrids/dataFields/siteFields";
import { Box } from "@chakra-ui/react";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function SitesPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    return redirect("/login");
  }

  const res = await fetch(
    `${process.env.BE_URL}/site/allBy?selectColumns=id,site_name,postcode,customer_id,is_active,uniqueId`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!res.ok) {
    return redirect("/error");
  }

  const sites = await res.json();
  const siteData = sites.resource;

  if (siteData && siteData.length > 0) {
    return (
      <>
        <Box zIndex={10000} bg="green" w={"100%"} h={20} position="relative" />
        <DataGridComponent
          data={siteData}
          initialFields={siteFields}
          createNewUrl={"/sites/create"}
        />
      </>
    );
  } else {
    return (
      <>
        <h1>No Sites Found</h1>
      </>
    );
  }
}

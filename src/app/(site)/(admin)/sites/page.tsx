import { redirect } from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { siteFields } from "@/components/agGrids/dataFields/siteFields";
import AdminHeader from "@/components/AdminHeader";
import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";

interface SearchParams {
  siteType?: string;
}

export default async function SitesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getUser();
  await checkUserRole("/sites");

  let url = `/getAllView?view=vwSitesList&customerId=not-null&selectColumns=id,siteName,siteUniqueId,custName,custUniqueId,custImageUrl,siteTypeName,address1,address3,postcode,isActive,primaryContactUniqueId,primaryContactFullName,primaryContactImageUrl`;
  let headerTitle = "Sites";
  let siteTypeParam = searchParams.siteType;
  let createNewUrl = "/sites/create";

  if (user.role === "CA") {
    if (!["internal", "external"].includes(siteTypeParam || "")) {
      siteTypeParam = "internal";
      headerTitle = "My Company Sites";
    }
    if (siteTypeParam === "internal") {
      headerTitle = "My Company Sites";
      url += `&customerId=${user.customerId}`;
      createNewUrl += `?siteType=internal`;
    } else if (siteTypeParam === "external") {
      headerTitle = "Our Client Sites";
      url += `&custParentId=${user.customerId}`;
      createNewUrl += `?siteType=external`;
    }
  } else if (user.role === "PA") {
    headerTitle = "Sites";
  }

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const sites = await res.json();
  const siteData = sites.resource || [];

  const siteCount = siteData ? siteData.length : 0;

  if (siteData) {
    return (
      <>
        <AdminHeader headingText={headerTitle} dataCount={siteCount} />
        <DataGridComponent
          data={siteData}
          initialFields={siteFields}
          createNewUrl={createNewUrl}
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

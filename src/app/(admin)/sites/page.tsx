import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {siteFields} from "@/components/agGrids/dataFields/siteFields";
import AdminHeader from "@/components/AdminHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function SitesPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch sites data from the backend
    const res = await fetch(`${process.env.BE_URL}/getAllView?view=vwSitesList&customerId=not-null&selectColumns=id,siteName,siteUniqueId,customerId,custName,siteTypeName,address1,postcode,isActive`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        return redirect("/error");
    }

    const sites = await res.json();
    const siteData = sites.resource;

    // Check if siteData exists and has data
    const siteCount = siteData ? siteData.length : 0;

    // Check if siteData exists and has data
    if (siteData && siteCount > 0) {
        return (
            <>
                <AdminHeader headingText={'SITES'} dataCount={siteCount} />
                <DataGridComponent data={siteData}
                                   initialFields={siteFields}
                                   createNewUrl={'/sites/create'}/>

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

import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {siteFields} from "@/components/agGrids/dataFields/siteFields";
import AdminHeader from "@/components/AdminHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface SearchParams {
    siteType?: string
}

export default async function SitesPage({searchParams}: { searchParams: SearchParams }) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    const uniqueId = cookieStore.get("user_uuid")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch user data
    let userIdentity = null;

    try {
        const identityResponse = await fetch(
            `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=customerId,role,userImageUrl,firstName`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (!identityResponse.ok) {
            throw new Error('Failed to fetch user identity');
        }

        userIdentity = (await identityResponse.json()).resource;
    } catch (error) {
        console.error("Error fetching user identity:", error);
        return redirect("/error");
    }

    // Decide what  the title should be and data being asked for
    let url = `${process.env.BE_URL}/getAllView?view=vwSitesList&customerId=not-null&selectColumns=id,siteName,siteUniqueId,custName,custUniqueId,custImageUrl,siteTypeName,address1,address3,postcode,isActive,primaryContactUniqueId,primaryContactFullName,primaryContactImageUrl`;
    let headerTitle = 'Sites';
    let siteTypeParam = searchParams.siteType;

    // Dynamically apply filters based on the role and siteTypeParam
    if (userIdentity.role === 'CA') {
        // Default siteTypeParam to 'internal' if it's not 'internal' or 'external'
        if (!['internal', 'external'].includes(siteTypeParam || '')) {
            siteTypeParam = 'internal';
            headerTitle = 'My Company Sites'
        }
        // Apply the appropriate query parameters based on the siteTypeParam
        if (siteTypeParam === 'internal') {
            headerTitle = 'My Company Sites';
            url += `&customerId=${userIdentity.customerId}`;
        } else if (siteTypeParam === 'external') {
            headerTitle = 'Our Client Sites';
            url += `&custParentId=${userIdentity.customerId}`;
        }
    } else if (userIdentity.role === 'PA') {
        headerTitle = 'Sites';
        // No additional filters for PA, the base URL is sufficient
    }

    // Fetch sites data from the backend
    const res = await fetch(url, {
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
                <AdminHeader headingText={headerTitle} dataCount={siteCount}/>
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

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Heading} from "@chakra-ui/react";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import DataGridComponentClient from "@/components/agGrids/DataGridComponentClient";
import {siteFields} from "@/components/agGrids/dataFields/siteFields";

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
    const res = await fetch(`${process.env.BE_URL}/site/allBy?selectColumns=id,site_name,postcode,customer_id,is_active`, {
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
    if (siteData && siteData.length > 0) {
        return (
            <>
                <Heading>Server Fetched Data</Heading>
                <DataGridComponent data={siteData}
                                   initialFields={siteFields}
                                   createNewUrl={'/sites/create'}/>

                <Heading mt={4}>Client Fetched Data with Server Route</Heading>
                <DataGridComponentClient
                    endpoint={'api/site/allBy?selectColumns=id,site_name,postcode,customer_id,is_active'}
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

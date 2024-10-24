import {redirect} from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {siteFields} from "@/components/agGrids/dataFields/siteFields";
import AdminHeader from "@/components/AdminHeader";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

interface SearchParams {
    siteType?: string
}

export default async function SitesPage({searchParams}: { searchParams: SearchParams }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/sites");

    let url = `/getAllView?view=vwSitesList&customerId=not-null&selectColumns=id,siteName,siteUniqueId,custName,custUniqueId,custImageUrl,siteTypeName,address1,address3,postcode,isActive,primaryContactUniqueId,primaryContactFullName,primaryContactImageUrl`;
    let headerTitle = 'Sites';
    let siteTypeParam = searchParams.siteType;
    let createNewUrl = '/sites/create';

    if (userIdentity.role === 'CA') {
        if (!['internal', 'external'].includes(siteTypeParam || '')) {
            siteTypeParam = 'internal';
            headerTitle = 'My Company Sites'
        }
        if (siteTypeParam === 'internal') {
            headerTitle = 'My Company Sites';
            url += `&customerId=${userIdentity.customerId}`;
            createNewUrl += `?siteType=internal`;
        } else if (siteTypeParam === 'external') {
            headerTitle = 'Our Client Sites';
            url += `&custParentId=${userIdentity.customerId}`;
            createNewUrl += `?siteType=external`;
        }
    } else if (userIdentity.role === 'PA') {
        headerTitle = 'Sites';
    }

    const res = await apiClient(url, {cache: "no-store"});

    if (!res.ok) {
        return redirect("/error");
    }

    const sites = await res.json();
    const siteData = sites.resource || [];

    const siteCount = siteData ? siteData.length : 0;

    if (siteData) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={siteCount}/>
                <DataGridComponent data={siteData}
                                   initialFields={siteFields}
                                   createNewUrl={createNewUrl}/>

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

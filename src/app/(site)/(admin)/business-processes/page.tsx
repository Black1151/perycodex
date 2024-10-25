import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {businessProcessFields} from "@/components/agGrids/dataFields/businessProcessFields";

export default async function WorkflowsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/business-processes");

    let url = '/businessProcess/allBy';
    let headerTitle = 'Business Processes';

    const res = await apiClient(url, { cache: "no-store" });

    if (!res.ok) {
        return redirect("/error");
    }

    const businessProcesses = await res.json();
    const businessProcessData = businessProcesses.resource;

    const businessProcessCount = businessProcessData ? businessProcessData.length : 0;

    if (businessProcessData) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={businessProcessCount}/>
                <DataGridComponent
                    data={businessProcessData}
                    initialFields={businessProcessFields}
                    createNewUrl={"/business-processes/create"}
                />
            </>
        );
    } else {
        return (
            <>
                <h1>No Business Processes Found</h1>
            </>
        );
    }
}

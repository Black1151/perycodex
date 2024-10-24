import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {toolFields} from "@/components/agGrids/dataFields/toolFields";

export default async function ToolsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/tools");

    let url = '/toolConfig/allBy';
    let headerTitle = 'Tools';

    const res = await apiClient(url, { cache: "no-store" });

    if (!res.ok) {
        return redirect("/error");
    }

    const tools = await res.json();
    const toolData = tools.resource || [];

    const toolCount = toolData ? toolData.length : 0;

    if (toolData) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={toolCount}/>
                <DataGridComponent
                    data={toolData}
                    initialFields={toolFields}
                    createNewUrl={"/tools/create"}
                />
            </>
        );
    } else {
        return (
            <>
                <h1>No Tags Found</h1>
            </>
        );
    }
}

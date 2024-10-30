import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {toolSubscriptionFields} from "@/components/agGrids/dataFields/toolSubscriptionFields";

export default async function ToolSubscriptionsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/tool-subscriptions");

    let url = '/getAllView?view=vwToolSubscriptionsList';
    let headerTitle = 'Tool Subscriptions';

    const res = await apiClient(url, {cache: "no-store"});

    if (!res.ok) {
        return redirect("/error");
    }

    const toolSubscriptions = await res.json();
    const toolSubscriptionData = toolSubscriptions.resource || [];

    const toolSubscriptionCount = toolSubscriptionData ? toolSubscriptionData.length : 0;

    if (toolSubscriptionData) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={toolSubscriptionCount}/>
                <DataGridComponent
                    data={toolSubscriptionData}
                    initialFields={toolSubscriptionFields}
                    createNewUrl={"/tool-subscriptions/create"}
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

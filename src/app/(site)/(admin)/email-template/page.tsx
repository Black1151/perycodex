import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {emailTemplateFields} from "@/components/agGrids/dataFields/emailTemplateFields";

export default async function EmailTemplatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/email-template");

    let url = '/getAllView?view=vwEmailTemplatesList';
    let headerTitle = 'Email Templates';

    const res = await apiClient(url, {cache: "no-store"});

    if (!res.ok) {
        return redirect("/error");
    }

    const emailTemplates = await res.json();
    const emailTemplateData = emailTemplates.resource || [];

    const emailTemplateCount = emailTemplateData ? emailTemplateData.length : 0;

    if (emailTemplateData) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={emailTemplateCount}/>
                <DataGridComponent
                    data={emailTemplateData}
                    initialFields={emailTemplateFields}
                    createNewUrl={"/email-template/create"}
                />
            </>
        );
    } else {
        return (
            <>
                <h1>No Templates Found</h1>
            </>
        );
    }
}

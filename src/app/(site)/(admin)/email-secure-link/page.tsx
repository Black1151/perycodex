import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {emailSecureLinkFields} from "@/components/agGrids/dataFields/emailSecureLinkFields";

export default async function EmailSecureLinkPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/email-secure-link");

    let url = '/getAllView?view=vwEmailSecureLinksList';
    let headerTitle = 'Email Secure Links';

    const res = await apiClient(url, {cache: "no-store"});

    if (!res.ok) {
        return redirect("/error");
    }

    const emailSecureLinks = await res.json();
    const emailSecureLinkData = emailSecureLinks.resource || [];

    const emailSecureLinkCount = emailSecureLinkData ? emailSecureLinkData.length : 0;

    if (emailSecureLinkData) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={emailSecureLinkCount}/>
                <DataGridComponent
                    data={emailSecureLinkData}
                    initialFields={emailSecureLinkFields}
                    createNewUrl={"/email-secure-link/create"}
                />
            </>
        );
    } else {
        return (
            <>
                <h1>No Links Found</h1>
            </>
        );
    }
}

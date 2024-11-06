import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {formFields} from "@/components/agGrids/dataFields/formFields";
import {checkUserRole} from "@/lib/dal";

export default async function FormsPage() {
    await checkUserRole("/forms");

    let url = '/getAllView?view=vwFormsList ';
    let headerTitle = 'Forms';

    const res = await apiClient(url, {cache: "no-store"});

    if (!res.ok) {
        return redirect("/error");
    }

    const forms = await res.json();
    const formData = forms.resource || [];

    const formCount = formData ? formData.length : 0;

    if (formData) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={formCount}/>
                <DataGridComponent
                    data={formData}
                    initialFields={formFields}
                    createNewUrl={"/forms/create"}
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

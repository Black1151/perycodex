import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {emailScheduleFields} from "@/components/agGrids/dataFields/emailScheduleFields";
import {checkUserRole} from "@/lib/dal";

export default async function EmailSchedulePage() {
    await checkUserRole("/email-schedule");

    let url = '/getAllView?view=vwEmailSchedulesList';
    let headerTitle = 'Email Schedules';

    const res = await apiClient(url, {cache: "no-store"});

    if (!res.ok) {
        return redirect("/error");
    }

    const emailSchedules = await res.json();
    const emailScheduleData = emailSchedules.resource || [];

    const emailScheduleCount = emailScheduleData ? emailScheduleData.length : 0;

    if (emailScheduleData) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={emailScheduleCount}/>
                <DataGridComponent
                    data={emailScheduleData}
                    initialFields={emailScheduleFields}
                    createNewUrl={"/email-schedule/create"}
                />
            </>
        );
    } else {
        return (
            <>
                <h1>No Schedules Found</h1>
            </>
        );
    }
}

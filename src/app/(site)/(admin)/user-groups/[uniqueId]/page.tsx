import {userGroupJson} from "@/components/surveyjs/forms/userGroup";
import {redirect} from "next/navigation";
import {UserGroupDetailsBanner} from "@/components/AdminDetailsBanners/UserGroupDetailsBanner";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import apiClient from "@/lib/apiClient";
import {checkUserRole} from "@/lib/dal";

export default async function UserGroupsDetailPage({params}: { params: { uniqueId: string } }) {
    await checkUserRole(`/user-groups/${params.uniqueId}`);

    const res = await apiClient(`/userGroup/findBy?uniqueId=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const userGroup = await res.json();
    const userGroupData = userGroup.resource;

    return (
        <div>
            <UserGroupDetailsBanner userGroup={userGroupData}/>
            <SurveyComponent
                surveyJson={userGroupJson}
                endpoint={`/userGroup/${params.uniqueId}`}
                isNew={false}
                dataset={userGroupData}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </div>
    );
};
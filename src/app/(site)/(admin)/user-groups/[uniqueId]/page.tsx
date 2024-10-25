import {userGroupJson} from "@/components/surveyjs/forms/userGroup";
import {redirect} from "next/navigation";
import {UserGroupDetailsBanner} from "@/components/AdminDetailsBanners/UserGroupDetailsBanner";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

export default async function UserGroupsDetailPage({params}: { params: { uniqueId: string } }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/user-groups/${params.uniqueId}`);

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
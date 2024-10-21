import {UserDetailsBanner} from "@/components/AdminDetailsBanners/UserDetailsBanner";
import {userJson} from "@/components/surveyjs/forms/user";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

export default async function MyProfilePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/my-profile`);

    const {userUniqueId} = userIdentity;

    const res = await apiClient(`/user/findBy?uniqueId=${userUniqueId}`);

    if (!res.ok) {
        return redirect('/error');
    }

    const user = await res.json();
    const userData = user.resource;

    return (
        <div>
            <UserDetailsBanner user={userData}/>
            <SurveyComponent
                surveyJson={userJson}
                endpoint={`/user/${userUniqueId}`}
                isNew={false}
                dataset={userData}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </div>
    );
}
;

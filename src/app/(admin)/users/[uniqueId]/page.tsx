import {UserDetailsBanner} from "@/components/AdminDetailsBanners/UserDetailsBanner";
import {userJson} from "@/components/surveyjs/forms/user";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

export default async function UsersDetailPage({params}: { params: { uniqueId: string } }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/users/${params.uniqueId}`);

    const res = await apiClient(`/user/findBy?uniqueId=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const user = await res.json();
    const userData = user.resource;

    return (
        <>
            <UserDetailsBanner user={userData}/>
            <SurveyComponent
                surveyJson={userJson}
                endpoint={`/user/${params.uniqueId}`}
                isNew={false}
                dataset={userData}
                sjsPath={'admin'}
            />
        </>
    );
};
import { UserDetailsBanner } from "@/components/AdminDetailsBanners/UserDetailsBanner";
import { userJson } from "@/components/surveyjs/forms/user";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";

export default async function MyProfilePage() {
  const user = await getUser();
  await checkUserRole(`/my-profile`);

  const { userUniqueId } = user;

  const res = await apiClient(`/user/findBy?uniqueId=${userUniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const pageUser = await res.json();
  const pageUserData = pageUser.resource;

  return (
    <>
      <UserDetailsBanner surveyUser={pageUserData} />
      <SurveyComponent
        surveyJson={userJson}
        layout={"default"}
        endpoint={`/user/${userUniqueId}`}
        isNew={false}
        excludeKeys={["imageUrl"]}
        dataset={pageUserData}
        sjsPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </>
  );
}

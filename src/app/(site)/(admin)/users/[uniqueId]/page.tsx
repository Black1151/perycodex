import { UserDetailsBanner } from "@/components/AdminDetailsBanners/UserDetailsBanner";
import { userJson } from "@/components/surveyjs/forms/user";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import apiClient from "@/lib/apiClient";
import { checkUserRole } from "@/lib/dal";

export default async function UsersDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/users/${params.uniqueId}`);

  const res = await apiClient(`/user/findBy?uniqueId=${params.uniqueId}`);

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
        endpoint={`/user/${params.uniqueId}`}
        layout={"default"}
        isNew={false}
        rolesCanEdit={["PA", "CA"]}
        dataset={pageUserData}
        excludeKeys={["imageUrl"]}
        sjsPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </>
  );
}

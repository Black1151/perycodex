import { redirect } from "next/navigation";
import { siteJson } from "@/components/surveyjs/forms/site";
import { SiteDetailsBanner } from "@/components/AdminDetailsBanners/SiteDetailsBanner";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import apiClient from "@/lib/apiClient";
import { checkUserRole } from "@/lib/dal";

export default async function SitesDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/sites/${params.uniqueId}`);

  const res = await apiClient(`/site/findBy?uniqueId=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const site = await res.json();
  const siteData = site.resource;

  return (
    <div>
      <SiteDetailsBanner site={siteData} />
      <SurveyComponent
        surveyJson={siteJson}
        endpoint={`/site/${params.uniqueId}`}
        rolesCanEdit={["PA", "CA"]}
        isNew={false}
        layout={"default"}
        dataset={siteData}
        sjsPath={"admin"}
        cssPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </div>
  );
}

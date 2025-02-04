import { siteJson } from "@/components/surveyjs/forms/site";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { checkUserRole, getUser } from "@/lib/dal";
import { redirect } from "next/navigation";

interface SearchParams {
  siteType?: string;
}

export default async function SitesCreatePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getUser();
  await checkUserRole(`/sites/create`);

  if (!["CA", "PA"].includes(user.role)) {
    return redirect("/");
  }

  let headerTitle = "Create Site";
  let siteTypeParam = searchParams.siteType;

  if (user.role === "CA") {
    if (!["internal", "external"].includes(siteTypeParam || "")) {
      siteTypeParam = "internal";
    }
    if (siteTypeParam === "internal") {
      headerTitle = "Create New Company Site ";
    } else if (siteTypeParam === "external") {
      headerTitle = "Create New Client Site";
    }
  } else if (user.role === "PA") {
    headerTitle = "Create Site";
  }

  const surveyVariables = [
    {
      siteType: {
        siteTypeParam,
      },
    },
  ];

  return (
    <>
      <AdminHeader headingText={headerTitle} />
      <SurveyComponent
        surveyJson={siteJson}
        endpoint={"/site"}
        isNew={true}
        layout={"default"}
        includeVariables={surveyVariables}
        redirectUrl={"/sites"}
        sjsPath={"admin"}
        cssPath={"admin"}
      />
    </>
  );
}

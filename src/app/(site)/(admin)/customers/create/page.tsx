import { customerJson } from "@/components/surveyjs/forms/customer";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { checkUserRole, getUser } from "@/lib/dal";

export default async function CustomersCreatePage() {
  const user = await getUser();
  await checkUserRole(`/customers/create`);

  let headerTitle = "Create Customer";

  if (user.role === "CA") {
    headerTitle = "Create New Client";
  }

  return (
    <>
      <AdminHeader headingText={headerTitle} />
      <SurveyComponent
        surveyJson={customerJson}
        endpoint={"/customer"}
        isNew={true}
        layout={"default"}
        excludeKeys={["imageUrl"]}
        redirectUrl={"/customers"}
        sjsPath={"admin"}
      />
    </>
  );
}

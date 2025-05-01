import AdminHeader from "@/components/AdminHeader";

import { businessProcessJson } from "@/components/surveyjs/forms/businessProcess";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function BusinessProcessCreatePage() {
  await checkUserRole("/business-processes/create");

  return (
    <>
      <AdminHeader headingText="Create Business Process" />
      <AdminFormWrapper
        formJson={businessProcessJson}
        data={null}
        layoutConfig={{
          layoutKey: "default",
          layoutProps: {},
        }}
        globalVariables={[]}
        stylingConfig={{
          sjsFilePath: "admin",
          cssFilePath: "admin",
        }}
        jsImport={""}
        excludeKeys={[]}
        endpoint={"/businessProcess"}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/business-processes"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}

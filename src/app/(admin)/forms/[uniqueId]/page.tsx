import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {FormDetailsBanner} from "@/components/AdminDetailsBanners/FormDetailsBanner";
import {formsJson} from "@/components/surveyjs/forms/forms";

export default async function FormsDetailPage({
                                                 params,
                                             }: {
    params: { uniqueId: string };
}) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/forms/${params.uniqueId}`);

    const res = await apiClient(`/form/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const form = await res.json();
    const formData = form.resource;

    return (
        <>
            <FormDetailsBanner form={formData}/>
            <SurveyComponent
                surveyJson={formsJson}
                endpoint={`/form/${params.uniqueId}`}
                isNew={false}
                dataset={formData}
                layout={'default'}
                sjsPath={'admin'}
            />
        </>
    );
}

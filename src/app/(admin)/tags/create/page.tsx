import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";

export default async function TagsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/tags/create`);

    return (
        <>
            <h1>Tags Creation to be implemented</h1>
        </>
    );
}

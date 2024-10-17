import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";

export default async function TagsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/tags");

    return (
        <>
            <h1>Tags to be implemented</h1>
        </>
    );
}

import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";

export default async function TagsDetailPage({
                                           params,
                                       }: {
    params: { uniqueId: string };
}) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/tags/${params.uniqueId}`);

    return (
        <div>
            <h1>Tags Update to be implemented</h1>
        </div>
    );
}

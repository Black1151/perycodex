import AdminHeader from "@/components/AdminHeader";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import CreateComponent from "@/app/(admin)/test-happiness-score-by-api/CreateComponent";
import {Text} from "@chakra-ui/react";

interface SearchParams {
    toolId?: string;
    workflowId?: string;
}

export default async function TestHappinessScorePage({searchParams}: { searchParams: SearchParams }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/test-happiness-score-by-api`);

    const tId = searchParams.toolId;
    const wfId = searchParams.workflowId;

    return (
        <>
            <AdminHeader headingText={'Start Test Happiness Score (API)'}/>
            <Text>Workflow ID: {wfId}</Text>
            <Text>Tool ID: {tId}</Text>
            <CreateComponent wfId={wfId} tId={tId}/>
        </>
    );
}


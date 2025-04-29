import { Center } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { redirect } from "next/navigation";
import PurchaseSubscriptionForm from "@/components/forms/PurchaseSubscriptionsForm";

export default async function PurchaseSubscriptionsPage() {
    return (
        <PerygonContainer>
            <Center flex={1}>
                <PurchaseSubscriptionForm />
            </Center>
        </PerygonContainer>
    );
}

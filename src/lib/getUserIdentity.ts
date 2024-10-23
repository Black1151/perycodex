import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import apiClient from "@/lib/apiClient";

export async function getUserIdentity() {
    const cookieStore = cookies();
    const uniqueId = cookieStore.get("user_uuid")?.value;
    const authToken = cookieStore.get("auth_token")?.value;

    // If either the uniqueId or authToken is missing, redirect to the login page
    if (!uniqueId || !authToken) {
        redirect('/login');
    }

    try {
        const response = await apiClient(
            `/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=customerId,customerUniqueId,role,userImageUrl,firstName,userUniqueId`,
        );

        if (!response.ok) {
            throw new Error('Failed to fetch user identity');
        }

        const userIdentity = (await response.json()).resource;

        // If userIdentity is not valid, redirect to login as a fallback
        if (!userIdentity) {
            redirect('/login');
        }

        return userIdentity;
    } catch (error) {
        console.error("Error fetching user identity:", error);
        // Redirect to login if there's an error fetching the user identity
        redirect('/login');
    }
}

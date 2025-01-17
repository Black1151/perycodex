import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import Google from "next-auth/providers/google";
import apiClient from "@/lib/apiClient";
import {NextResponse} from "next/server";


const AZURE_AD_CLIENT_ID='80b0a206-ea3a-4f28-a8d0-aadbb1655bd5';
const AZURE_AD_CLIENT_SECRET='0gj8Q~moeoK0GMU1gE2.GemT_Gf~hrbU036cKdkr';
const AZURE_AD_TENANT_ID='7104784f-19f4-44e4-9fea-2f732f3134e4';
const GOOGLE_CLIENT_ID='482345564570-3bmg8qh4snqfrlo25dlj8k4kvrh3fn37.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET='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';

const handler = NextAuth({
    debug: true,
    secret: AZURE_AD_CLIENT_SECRET,
    providers: [
        AzureADProvider({
            clientId: AZURE_AD_CLIENT_ID,
            clientSecret: AZURE_AD_CLIENT_SECRET,
            tenantId: AZURE_AD_TENANT_ID,
            authorization: {
                params: {
                    authorizationUrl: `https://login.microsoftonline.com/${AZURE_AD_TENANT_ID}/oauth2/v2.0/authorize`,
                    tokenUrl: `https://login.microsoftonline.com/${AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
                    scope: 'openid profile email',
                    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/azure-ad`,
                }
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,  // Your Google Client ID
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,  // Your Google Client Secret
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    events: {
        async signOut() {
        },
    },
    pages: {
        signIn: 'auth/sign-in',
        signOut: 'auth/sign-out'
    },
    // callbacks: {
    //     async session({ session, token }) {
    //
    //         console.log('Session below:');
    //         console.log(session);
    //         // Modify the session object as needed
    //         session.accessToken = token.accessToken;
    //         session.idToken = token.idToken;
    //
    //         // Make an API call to handle further logic, like saving or updating user data
    //         const response = await apiClient("/authentication/login", {
    //             method: "POST",
    //             body: JSON.stringify({
    //                 loginType: "sso",
    //                 email: session.user.email
    //             }),
    //         });
    //
    //         console.log('response below:');
    //         console.log(response);
    //         const data = await response.json();
    //         console.log('response body:');
    //         console.log(data);
    //
    //         if (!response.ok) {
    //             const errorMessage = data?.error || "Invalid login credentials";
    //             throw new Error(errorMessage);  // Throw error if API call fails
    //         }
    //
    //         const { authToken, UUID, role, isProfileRegistered } = data.resource;
    //
    //         let redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
    //
    //         if (!isProfileRegistered) {
    //             redirectUrl += "/profile-setup";
    //         } else if (role === "PA") {
    //             redirectUrl += "/customers";
    //         }
    //         const res = NextResponse.json({ redirectUrl });
    //
    //         res.cookies.set("auth_token", authToken, {
    //             httpOnly: true,
    //             secure: process.env.NODE_ENV === "production",
    //             sameSite: "strict",
    //         });
    //
    //         res.cookies.set("user_uuid", UUID, {
    //             httpOnly: true,
    //             secure: process.env.NODE_ENV === "production",
    //             sameSite: "strict",
    //         });
    //
    //         // Modify session based on API response
    //         session.redirectUrl = redirectUrl;
    //         session.authToken = authToken;
    //         session.userUuid = UUID;
    //
    //         // Return the modified session object
    //         return session;
    //     },
    // },
});

export { handler as GET, handler as POST }

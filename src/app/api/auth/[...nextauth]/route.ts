import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import Google from "next-auth/providers/google";
import apiClient from "@/lib/apiClient";
import {NextResponse} from "next/server";

const { AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID } =
    process.env;

if (!AZURE_AD_CLIENT_ID || !AZURE_AD_CLIENT_SECRET || !AZURE_AD_TENANT_ID) {
    throw new Error("The Azure AD environment variables are not set.");
}

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
                    redirect_uri: "http://localhost:3000/api/auth/callback/azure-ad",
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

import NextAuth, {type NextAuthOptions, SessionStrategy} from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import crypto from "crypto";
import {randomUUID} from "node:crypto";
import { type DefaultJWT } from "next-auth/jwt"; // Import the correct type
import { type DefaultSession } from "next-auth"; // Import the correct type
import { Account, Profile, User } from "next-auth";
import { cookies } from 'next/headers'; // Import the cookies function
import { NextRequest, NextResponse } from "next/server";
//

const AZURE_AD_CLIENT_ID='80b0a206-ea3a-4f28-a8d0-aadbb1655bd5';
const AZURE_AD_CLIENT_SECRET='0gj8Q~moeoK0GMU1gE2.GemT_Gf~hrbU036cKdkr';
const AZURE_AD_TENANT_ID='7104784f-19f4-44e4-9fea-2f732f3134e4';
const GOOGLE_CLIENT_ID='482345564570-3bmg8qh4snqfrlo25dlj8k4kvrh3fn37.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET='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';
const APPLE_CLIENT_ID = 'uk.co.perygon';
const APPLE_CLIENT_SECRET = 'eyJhbGciOiJFUzI1NiIsImtpZCI6Ik5MM1BKVDNZSloifQ.eyJhdWQiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiaXNzIjoiUDM0VUpRVEZKVCIsImlhdCI6MTczOTgwMTQwNSwiZXhwIjoxNzU1MzQ1MTM0LCJzdWIiOiJ1ay5jby5wZXJ5Z29uIn0.ZeHp9PN4se6-9ersWfXT6fOLT8W22kWmG1vB50AQNvBmVfnO2i2KrqZuKBtak9Xe15VgefZwNexNdsBR-q-IGw';

function generateCodeChallenge(codeVerifier: string) {
    const msg = Buffer.from(codeVerifier, 'utf8');
    const hash = crypto.createHash('sha256').update(msg).digest();
    const base64Digest = hash.toString('base64url');
    return base64Digest;
}

declare module "next-auth" {
    interface session {
        user: {
            id: string; // Add the id property
        } & DefaultSession["user"]; // Keep existing user properties
        accessToken?: string;
        idToken?: string;
        accountProvider?: string;
    }
}

const authOptions: NextAuthOptions = {
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
                    scope: 'openid profile email User.Read',
                    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/azure-ad`,
                }
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,  // Your Google Client ID
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,  // Your Google Client Secret
            checks: ['none']
        }),
        Apple({
            clientId: APPLE_CLIENT_ID!,
            clientSecret: APPLE_CLIENT_SECRET!,
            // checks: ['none'],
            authorization: {
                params: {
                    scope: "openid email",
                    prompt: "select_account",
                    // nonce: crypto.randomBytes(16).toString("hex"),
                } as unknown as Record<string, any>,
            },
        }),

    ],
    cookies: {
        pkceCodeVerifier: {
            name: "next-auth.pkce.code_verifier",
            options: {
                httpOnly: true,
                sameSite: "none",
                path: "/",
                secure: true,
            },
        },
    },
    session: {
        strategy: 'jwt' as SessionStrategy, // Correct way to set the strategy
    },
    events: {
        async signOut() {
        },
    },
    pages: {
        signIn: 'auth/sign-in',
        signOut: 'auth/sign-out'
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            return url.startsWith('/') ? new URL(url, baseUrl).toString() : url;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.accountProvider = account.provider;
            }
            return token;
        },
        async session({ session, token }) {

            if (token && typeof token.accessToken === 'string') {
                session.accessToken = token.accessToken;
            }
            if (token && typeof token.idToken === 'string') {
                session.idToken = token.idToken;
            }
            if (token && typeof token.accountProvider === 'string') {
                session.accountProvider = token.accountProvider;
            }

            // Return the modified session object
            return session;
        },
    },
};

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const provider = url.searchParams.get("provider");

    console.log('provider is: ');
    console.log(request.url);
    // if (provider === 'apple') {
        const codeVerifier = randomUUID();
        const codeChallenge = generateCodeChallenge(codeVerifier);
        const state = randomUUID();

        const authorizationUrl = `https://appleid.apple.com/auth/authorize?response_type=code&response_mode=form_post&client_id=${APPLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/&scope=openid%20name%20email&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        const response = new NextResponse(null, {
            status: 302,
            headers: [
                ['Set-Cookie', `code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`],
                ['Set-Cookie', `state=${state}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`],
                ['Location', authorizationUrl],
            ],
        });
        return response;
    // }

    // return Response.json(request);
}

    // const url = new URL(req.url);
    // const provider = url.searchParams.get("provider");
    //
    // if (provider === 'apple') {
    //     const codeVerifier = randomUUID();
    //     const codeChallenge = generateCodeChallenge(codeVerifier);
    //     const state = randomUUID();
    //
    //     const authorizationUrl = `https://appleid.apple.com/auth/authorize?response_type=code&client_id=${APPLE_CLIENT_ID}&redirect_uri=${process.env.NEXTAUTH_URL}/api/auth/callback/apple&scope=openid%20name%20email&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    //
    //     const response = new NextResponse(null, {
    //         status: 302,
    //         headers: [
    //             ['Set-Cookie', `code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`],
    //             ['Set-Cookie', `state=${state}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`],
    //             ['Location', authorizationUrl],
    //         ],
    //     });
    //     return response;
    // }
    //
    // // Handle Apple callback specifically:
    // if (url.pathname === '/api/auth/callback/apple') {
    //     const receivedState = url.searchParams.get('state');
    //     const cookieStore = cookies(); // Get the cookie store
    //
    //     const storedState = cookieStore.get('state')?.value; // Access cookies
    //
    //     const code = url.searchParams.get('code');
    //     const storedCodeVerifier = cookieStore.get('code_verifier')?.value;
    //
    //
    //     if (!receivedState || !storedState || receivedState !== storedState) {
    //         return new NextResponse("Invalid state parameter", { status: 400 }); // Or redirect
    //     }
    //
    //     if (!code || !storedCodeVerifier){
    //         return new NextResponse("Missing code or code verifier", {status: 400});
    //     }
    //
    //     // Now you have the code and code_verifier, and the state matches!
    //     // You can proceed with the token exchange with Apple's API.
    //     try {
    //         const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             body: new URLSearchParams({
    //                 grant_type: 'authorization_code',
    //                 code: code,
    //                 redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/apple`,
    //                 client_id: APPLE_CLIENT_ID,
    //                 client_secret: APPLE_CLIENT_SECRET,
    //                 code_verifier: storedCodeVerifier, // Use the stored verifier
    //             }),
    //         });
    //
    //         if (!tokenResponse.ok) {
    //             const errorData = await tokenResponse.json();
    //             console.error("Apple token exchange error:", errorData);
    //             return new NextResponse("Apple token exchange failed", { status: 500 }); // Or redirect
    //         }
    //
    //         const tokenData = await tokenResponse.json();
    //         console.log('token data', tokenData);
    //
    //         // Now you have the tokenData, you can create a new session or jwt
    //         // ... (your logic to sign the user in using the tokenData)
    //
    //         // Example: redirect to the home page after successful authentication
    //         return NextResponse.redirect(new URL('/', req.url));
    //
    //     } catch (error) {
    //         console.error("Error during Apple token exchange:", error);
    //         return new NextResponse("An error occurred during authentication", { status: 500 });
    //     }
    //
    // }
    //
    // return handler(req); // Delegate to NextAuth.js for other providers and requests
// }

const handler = NextAuth(authOptions);

export { handler as POST }

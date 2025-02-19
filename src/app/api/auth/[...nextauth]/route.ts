import NextAuth, {SessionStrategy} from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import crypto from "crypto";
import {randomUUID} from "node:crypto";
import {NextResponse} from "next/server";
import { type DefaultJWT } from "next-auth/jwt"; // Import the correct type
import { type DefaultSession } from "next-auth"; // Import the correct type
import { AdapterUser } from "next-auth/adapters"; // Import AdapterUser type
import { Account, Profile, User } from "next-auth";

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



export const authOptions = {
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
        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) { // Explicit types
            return url.startsWith('/') ? new URL(url, baseUrl).toString() : url;
        },
        async jwt({ token, account }: { token: DefaultJWT; account: Account | null }) { // Explicit types
            if (account) {
                token.accessToken = account.access_token;
                token.accountProvider = account.provider;
            }
            return token;
        },
        async session({ session, token }: { session: DefaultSession; token: DefaultJWT }) {
            // if (session?.user) {
            //     session.user.id = token.sub ?? "";
            // }
            // if (token && typeof token.accessToken === 'string') {
            //     session.accessToken = token.accessToken;
            // }
            // if (token && typeof token.idToken === 'string') {
            //     session.idToken = token.idToken;
            // }
            // if (token && typeof token.accountProvider === 'string') {
            //     session.accountProvider = token.accountProvider;
            // }

            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export async function GET(req: Request) {
    const url = new URL(req.url);
    const provider = url.searchParams.get("provider");

    if (provider === 'apple') {
        const codeVerifier = randomUUID();
        if (!codeVerifier) {
            throw new Error("Could not generate code verifier");
        }
        const codeChallenge = generateCodeChallenge(codeVerifier);

        // Generate a state value (important!)
        const state = randomUUID(); // Or use a more robust method

        const authorizationUrl = `https://appleid.apple.com/auth/authorize?response_type=code&client_id=${process.env.APPLE_CLIENT_ID}&redirect_uri=${process.env.NEXTAUTH_URL}/api/auth/callback/apple&scope=openid%20name%20email&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        const response = new NextResponse(null, {
            status: 302,
            headers: {
                'Set-Cookie': `code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
                'Location': authorizationUrl,
            },
        });
        return response;
    }

    return handler(req); // Delegate to NextAuth.js for other providers and requests
}

export { handler as POST };

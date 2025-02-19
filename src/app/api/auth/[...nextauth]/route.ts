import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { Account, Profile, User } from "next-auth";

const AZURE_AD_CLIENT_ID='80b0a206-ea3a-4f28-a8d0-aadbb1655bd5';
const AZURE_AD_CLIENT_SECRET='0gj8Q~moeoK0GMU1gE2.GemT_Gf~hrbU036cKdkr';
const AZURE_AD_TENANT_ID='7104784f-19f4-44e4-9fea-2f732f3134e4';
const GOOGLE_CLIENT_ID='482345564570-3bmg8qh4snqfrlo25dlj8k4kvrh3fn37.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET='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';
const APPLE_CLIENT_ID = 'uk.co.perygon';
const APPLE_CLIENT_SECRET = 'eyJhbGciOiJFUzI1NiIsImtpZCI6Ik5MM1BKVDNZSloifQ.eyJhdWQiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiaXNzIjoiUDM0VUpRVEZKVCIsImlhdCI6MTczOTgwMTQwNSwiZXhwIjoxNzU1MzQ1MTM0LCJzdWIiOiJ1ay5jby5wZXJ5Z29uIn0.ZeHp9PN4se6-9ersWfXT6fOLT8W22kWmG1vB50AQNvBmVfnO2i2KrqZuKBtak9Xe15VgefZwNexNdsBR-q-IGw';

declare module "next-auth" {
    interface Session {
        pkce_code_verifier?: string | null;
    }
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
            authorization: {
                params: {
                    scope: "openid email",
                    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/apple`,
                }
            }
        })
    ],
    cookies: {
        pkceCodeVerifier: {
            name: "next-auth.pkce.code_verifier",
            options: {
                httpOnly: true,
                sameSite: "None",
                secure: true,
            },
        },
    },
    session: {
        strategy: 'jwt',
    },
    jwt: {
        encode: async ({ secret, token }) => {
            if (token) {
                return JSON.stringify({ ...token, code_verifier: sessionStorage.getItem("pkce_code_verifier") });
            }
            return "";
        },
        decode: async ({ secret, token }) => {
            return JSON.parse(token ?? "{}");
        }
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

            if (typeof window !== "undefined") {
                session.pkce_code_verifier = new URLSearchParams(window.location.search).get("pkce_code_verifier");
            }

            // Return the modified session object
            return session;
        },
        async signIn({ user, account, profile }: { user: User, account: Account | null, profile?: Profile }) {
            if (account !== null) {
                if (typeof account.code_verifier === "string") {
                    sessionStorage.setItem("pkce_code_verifier", account.code_verifier);
                }
            }
            return true;
        },
    },
});

export { handler as GET, handler as POST }

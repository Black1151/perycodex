// next-auth.d.ts
import NextAuth, { Session } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;  // Access token property (optional)
        idToken?: string;      // ID token property (optional)
        accountProvider?: string; // Account provider (optional)
    }
}

'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        return (
            <div>
                <button onClick={() => signIn('azure-ad-b2c')}>Sign in</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Welcome {session.user?.name}</h1>
            <h1>Your user email is: {session.user?.email}</h1>

            <button onClick={() => signOut({callbackUrl: '/login'})}>Sign out</button>
        </div>
    );
}

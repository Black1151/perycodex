// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to the login page
  if (!token) {
    console.log(req);
    // return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next(); // Allow the request to continue if authenticated
}

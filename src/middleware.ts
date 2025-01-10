import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import apiClient from "./lib/apiClient";


import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session
    },
  };
}

export async function middleware(request: NextRequest) {
  let cookieToken = request.cookies.get("auth_token")?.value;
  let apiToken = cookieToken;
  const session = await getSession({ req: request });
  console.log(session);

  if (!cookieToken) {
    const loginResponse = await apiClient(
        `/authentication/login`,
        {
          method: "POST",
          body: JSON.stringify({
            email: session,
          })
        },
    );
    let apiToken = loginResponse.body;
    console.log(apiToken);
  }

  if (!apiToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    response.cookies.delete("user_uuid");
    response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
    );
    return response;
  }

  try {
    const { status, ok } = await apiClient(`/authentication/check`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    if (!ok || status !== 200) {

      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      response.cookies.delete("user_uuid");
      response.headers.set(
          "Cache-Control",
          "no-store, no-cache, must-revalidate"
      );
      return response;
    }

    const response = NextResponse.next();
    response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
    );
    return response;
  } catch (error: any) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    response.cookies.delete("user_uuid");
    response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
    );
    return response;
  }
}

export const config = {
  matcher: ["/", "/profile-setup"],
};

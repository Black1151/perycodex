// app/api/auth/route.ts

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const response = await axios.post(
      `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        grant_type: "password",
        username,
        password,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Handle response and potentially set a cookie or session here
    if (response.status === 200) {
      return NextResponse.redirect("/");
    } else {
      return NextResponse.json({ error: "Login failed" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

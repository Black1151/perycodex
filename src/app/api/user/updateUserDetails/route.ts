import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/lib/apiClient"; // Assuming your fetch-based apiClient is in this location

// Function to recursively convert specified keys from strings to integers
function convertSpecifiedKeysToIntegers(
  obj: any,
  keysToConvert: string[]
): any {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (keysToConvert.includes(key) && typeof obj[key] === "string") {
        obj[key] = parseInt(obj[key], 10);
      }
      if (typeof obj[key] === "object" && obj[key] !== null) {
        convertSpecifiedKeysToIntegers(obj[key], keysToConvert);
      }
    }
  }
  return obj;
}

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;

  if (!uniqueId) {
    return NextResponse.json(
      { error: "User UUID not found in cookies." },
      { status: 400 }
    );
  }

  let { data } = await req.json();

  // Define an array of keys to convert to integers
  const keysToConvert = [
    "titleId",
    "siteId",
    "departmentId",
    "teamId",
    "contractTypeId",
    "jobLevelId",
  ];

  // Convert specified keys in the data object to integers
  data = convertSpecifiedKeysToIntegers(data, keysToConvert);

  console.log(data);
  console.log("sttringy", JSON.stringify(data));

  try {
    const response = await apiClient(`/user/${uniqueId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const userData = await response.json();
    return NextResponse.json({ userData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

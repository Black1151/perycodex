import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

// Handles the POST request
export async function POST(
    req: NextRequest,
    {params}: { params: { endpoint: string } }
) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    console.log("Received POST request");
    console.log("Endpoint:", params.endpoint);
    console.log("Auth token found:", authToken ? "Yes" : "No");

    try {
        // Parse the incoming JSON body
        const filteredSurveyData = await req.json();
        console.log("Parsed POST request body:", filteredSurveyData);

        // Construct the backend URL for POST
        const backendUrl = `${process.env.BE_URL}/${params.endpoint}`;
        console.log("POST request URL:", backendUrl);

        // Make the POST request to the backend
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: authToken ? `Bearer ${authToken}` : "",
            },
            body: JSON.stringify(filteredSurveyData),
        });

        console.log("POST request sent, waiting for response...");

        const responseData = await response.json();
        console.log("POST response received:", responseData);

        if (!response.ok) {
            console.error("POST request failed with status:", response.status);
            return NextResponse.json(
                {error: responseData.message || "Request failed"},
                {status: response.status}
            );
        }

        // Return the successful response data
        console.log("POST request successful");
        return NextResponse.json(responseData, {status: 200});
    } catch (error: any) {
        console.error("Error in POST request:", error.message);
        return NextResponse.json(
            {error: error.message || "Something went wrong"},
            {status: 500}
        );
    }
}

// Handles the PUT request
export async function PUT(
    req: NextRequest,
    {params}: { params: { endpoint: string } }
) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    console.log("Received PUT request");
    console.log("Endpoint:", params.endpoint);
    console.log("Auth token found:", authToken ? "Yes" : "No");

    try {
        // Parse the incoming JSON body
        const filteredSurveyData = await req.json();
        console.log("Parsed PUT request body:", filteredSurveyData);

        // Extract uniqueId and construct the backend URL for PUT
        const uniqueId = filteredSurveyData.uniqueId;
        const backendUrl = `${process.env.BE_URL}/${params.endpoint}/${uniqueId}`;
        console.log("PUT request URL:", backendUrl);

        // Prepare the PUT request body
        const requestBody = filteredSurveyData.data;
        console.log("PUT request body:", requestBody);

        // Make the PUT request to the backend
        const response = await fetch(backendUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: authToken ? `Bearer ${authToken}` : "",
            },
            body: JSON.stringify(requestBody),
        });

        console.log("PUT request sent, waiting for response...");

        const responseData = await response.json();
        console.log("PUT response received:", responseData);

        if (!response.ok) {
            console.error("PUT request failed with status:", response.status);
            return NextResponse.json(
                {error: responseData.message || "Request failed"},
                {status: response.status}
            );
        }

        // Return the successful response data
        console.log("PUT request successful");
        return NextResponse.json(responseData, {status: 200});
    } catch (error: any) {
        console.error("Error in PUT request:", error.message);
        return NextResponse.json(
            {error: error.message || "Something went wrong"},
            {status: 500}
        );
    }
}

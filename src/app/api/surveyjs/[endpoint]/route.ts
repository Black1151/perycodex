import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

// Handles both POST and PUT requests dynamically
export async function POST(
    req: NextRequest,
    {params}: { params: { endpoint: string } }
) {
    return handleRequest(req, params.endpoint, "POST");
}

export async function PUT(
    req: NextRequest,
    {params}: { params: { endpoint: string } }
) {

    return handleRequest(req, params.endpoint, "PUT");
}

// Main function to handle the logic for both POST and PUT
async function handleRequest(
    req: NextRequest,
    endpoint: string,
    requestType: "POST" | "PUT"
) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    try {
        // Parse the incoming JSON body to get filteredSurveyData
        const filteredSurveyData = await req.json();

        let backendUrl = `${process.env.BE_URL}/${endpoint}`;
        let requestBody = filteredSurveyData;

        // Handle the PUT request: extract uniqueId and adjust backendUrl
        if (requestType === "PUT") {
            const uniqueId = filteredSurveyData.uniqueId;
            backendUrl = `${process.env.BE_URL}/customer/${uniqueId}`;
            requestBody = filteredSurveyData.data;
        }

        // Make the request to the backend with the constructed body
        const response = await fetch(backendUrl, {
            method: requestType,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: authToken ? `Bearer ${authToken}` : "",
            },
            body: JSON.stringify(requestBody),
        });

        // Check for response success or failure
        const responseData = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {error: responseData.message || "Request failed"},
                {status: response.status}
            );
        }

        // Return the successful response data
        return NextResponse.json(responseData, {status: 200});
    } catch (error: any) {
        // Handle any errors and return a 500 response
        return NextResponse.json(
            {error: error.message || "Something went wrong"},
            {status: 500}
        );
    }
}

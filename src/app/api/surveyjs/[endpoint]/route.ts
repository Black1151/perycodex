import {NextRequest, NextResponse} from 'next/server';
import {cookies} from "next/headers";

export async function POST(req: NextRequest, {params}: { params: { endpoint: string } }) {
    console.log(params);
    return handleRequest(req, params.endpoint, 'POST');
}

export async function PUT(req: NextRequest, {params}: { params: { endpoint: string } }) {
    return handleRequest(req, params.endpoint, 'PUT');
}

async function handleRequest(req: NextRequest, endpoint: string, requestType: 'POST' | 'PUT') {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    console.log("I am here");

    try {
        // Read the JSON body (filteredSurveyData)
        const filteredSurveyData = await req.json();

        console.log(filteredSurveyData);

        // Define the backend URL dynamically based on the endpoint
        const backendUrl = `${process.env.BE_URL}/${endpoint}`;

        console.log(endpoint)
        console.log(backendUrl);

        // Make the request to the backend with the filteredSurveyData
        const response = await fetch(backendUrl, {
            method: requestType,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: authToken ? `Bearer ${authToken}` : "",
            },
            body: JSON.stringify(filteredSurveyData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            return NextResponse.json({error: errorData.message}, {status: response.status});
        }

        const responseData = await response.json();
        return NextResponse.json(responseData, {status: 200});

    } catch (error: any) {
        return NextResponse.json({error: error.message || 'Something went wrong'}, {status: 500});
    }
}

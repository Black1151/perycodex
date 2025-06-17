import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";


interface BigUpCategoryPayload {
    name: string;
    description: string;
    points: number;
    isActive: boolean;
}

interface BigUpCategory {
    uniqueId: number;
    name: string;
    description: string;
    points: number;
    isActive: boolean;
}

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const customerId = searchParams.get('customerId') || null;

        const response = await apiClient(
            `/userBigupType/allBy?selectColumns=id,name,description,points,isActive&customerId=${customerId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error: any) {
        const errorMessage =
            error.message ||
            "An error occurred while fetching BigUp categories data.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        console.log("POST /api/bigup/categories: Request started.");
        console.log("req cookies:", req.cookies)
        const authToken = req.headers.get('authorization')?.split(' ')[1]

        const { name, description, points, isActive }: BigUpCategoryPayload = await req.json();
        console.log("POST /api/bigup/categories: Received body - name:", name, ", description:", description, ", points:", points);

        console.log("POST /api/bigup/categories: Making apiClient call to /userBigupType");
        const response = await apiClient(`/userBigupType`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken ? `${authToken}` : "",
            },
            body: JSON.stringify({
                name,
                description,
                points,
                isActive
            }),
        });
        console.log("POST /api/bigup/categories: apiClient response", response);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("POST /api/bigup/categories: apiClient error response:", errorData);
            throw new Error(errorData.error || "Failed to create category on external API");
        }

        const data = await response.json();
        console.log("POST /api/bigup/categories: apiClient successful data:", data);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("POST /api/bigup/categories: Error in catch block:", error);
        const errorMessage =
            error.message || "An error occurred while creating BigUp category.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        console.log("PUT /api/bigup/categories: Request started.");
        console.log("req cookies:", req.cookies)
        const authToken = req.headers.get('authorization')?.split(' ')[1]

        const body = await req.json();
        console.log("PUT /api/bigup/categories: Full request body:", body);
        const { uniqueId, name, description, points, isActive }: BigUpCategory = body;
        console.log("PUT /api/bigup/categories: Received body - uniqueId:", uniqueId, ", name:", name, ", description:", description, ", points:", points, "isActive:", isActive);

        if (!uniqueId) {
            return NextResponse.json(
                { error: "Missing required parameter: id" },
                { status: 400 }
            );
        }

        console.log("PUT /api/bigup/categories: Making apiClient call to /userBigupType");
        const response = await apiClient(`/userBigupType/${uniqueId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken ? `${authToken}` : "",
            },
            body: JSON.stringify({
                name,
                description,
                points,
                isActive
            }),
        });
        console.log("PUT /api/bigup/categories: apiClient response", response);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("PUT /api/bigup/categories: apiClient error response:", errorData);
            throw new Error(errorData.error || "Failed to update category on external API");
        }

        const data = await response.json();
        console.log("PUT /api/bigup/categories: apiClient successful data:", data);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("PUT /api/bigup/categories: Error in catch block:", error);
        const errorMessage =
            error.message || "An error occurred while updating BigUp category.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}


import {NextRequest, NextResponse} from "next/server";
import apiClient from "@/lib/apiClient";
import { 
    clientSatisfactionDashboardResponse,
    kpiData,
    npsScore,
    staffRating,
    staffComment,
    serviceRating,
    serviceComment,
    npsData,
    companyComment, 
} from "@/app/(site)/(apps)/client-satisfaction/dashboard/primary/types";

export async function POST(req: NextRequest) {
    console.log("Client Satisfaction Dashboard API called");

    try {
        const body = await req.json();

        console.log(body);

        const response = await apiClient(
            '/dashboards/clientSatisfaction/getSummary',
            {
                method: 'POST',
                body: JSON.stringify(body),
            })

            console.log(response);

        if (!response.ok) {
            throw new Error("Failed to fetch client satisfaction summary data");
        }

        const allData: clientSatisfactionDashboardResponse = await response.json();

        return NextResponse.json({
            ...allData,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            {error: error.message || "An error occurred."},
            {status: 500},
        );
    }
}

export interface clientSatisfactionDashboardResponse {
    resource: {
        kpi: kpiData;
        nps: npsScore[];
        topStaff: staffRating[];
        bottomStaff: staffRating[];
        staff: {
            staffAvgRating: staffRating[];
            staffComments: staffComment[];
        };
        service: {
            serviceAvgRating: serviceRating[];
            serviceComments: serviceComment[];
        }
        companyComments: companyComment[];
    };
}

export interface kpiData {
    avgStaffRating: number;
    avgServiceRating: number;
    avgOverallRating: number;
    nps: number;
    feedbackCount: number,
}

export interface npsScore {
    score: number;
    detractors: number;
    passives: number;
    promoters: number;
    totalResponses: number;
    monthYear: string;
}

export interface staffRating {
    staffId: string;
    staffName: string;
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    avgRating: number;
}

export interface staffComment {
    staffId: string;
    staffName: string;
    comment: string;
    site: string;
    date: string;
    clientId: string;
    clientName: string;
    rating: number;
}

export interface serviceRating {
    serviceId: string;
    serviceName: string;
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    avgRating: number;
    monthYear: string;
}

export interface serviceComment {
    serviceId: string;
    serviceName: string;
    comment: string;
    site: string;
    date: string;
    clientId: string;
    clientName: string;
    rating: number;
}

export interface npsData {
    scores: npsScore[];
}

export interface companyComment {
    comment: string;
    site: string;
    date: string;
    clientId: string;
    clientName: string;
    rating: number;
}


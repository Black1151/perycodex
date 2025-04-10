interface ServiceDashboardProps {
    resource: {
        serviceComments: serviceComment[];
        serviceStats: serviceStat[];
        highestRatedService: serviceStat[];
        highestResponseService: serviceStat[];
        serviceNPS: npsScore[];
        histogramDataSet: histogramData[];
    }
}

interface serviceComment {
    serviceName: string;
    date: string;
    site: string;
    rating: number;
    comment: string;
    clientName: string;  
}

interface serviceStat {
    serviceName: string;
    avgRating: number;
    totalResponses: number;
}

export interface npsScore {
    serviceName: string;
    score: number;
    detractors: number;
    passives: number;
    promoters: number;
    totalResponses: number;
}

interface histogramData {
    value: number; // 0-10 x axis
    count: number // y axis
}
interface MyClientsDashboardProps {
    resource: {
        myComments: staffComment[];
        myStats: staffStats;
        myCompanyStats: companyStat[];
        histogramDataSet: histogramData[];
    }
}

interface staffComment {
    clientId: string;
    clientName: string;  
    clientImgUrl: string;
    date: string;
    rating: number;
    comment: string;
}

interface staffStats {
    avgRating: number;
    totalResponses: number;
    nps: npsScore;
}

interface npsScore {
    score: number;
    detractors: number;
    passives: number;
    promoters: number;
}

interface companyStat {
    monthYear: string;
    serviceRating: number;
    officeRating: number;
    companyRating: number;
    myRating: number;
}

interface histogramData {
    value: number; // 0-10 x axis
    count: number // y axis
}
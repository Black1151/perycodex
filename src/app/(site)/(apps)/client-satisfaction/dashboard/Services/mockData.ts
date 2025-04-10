import { ServiceDashboardProps } from "./types";

export const mockServiceDashboardData: ServiceDashboardProps = {
    resource: {
      serviceComments: [
        {
          serviceName: "Physiotherapy",
          date: "2025-04-01",
          site: "Leeds Clinic",
          rating: 9,
          comment: "Really helpful session with great advice!",
          clientName: "John Smith"
        },
        {
          serviceName: "Massage Therapy",
          date: "2025-04-02",
          site: "Liverpool Branch",
          rating: 10,
          comment: "Best massage I've ever had.",
          clientName: "Emily Brown"
        },
        {
          serviceName: "Chiropractic",
          date: "2025-04-03",
          site: "Manchester Centre",
          rating: 6,
          comment: "Good, but felt a little rushed.",
          clientName: "Luke Harris"
        }
      ],
      serviceStats: [
        {
          serviceName: "Physiotherapy",
          avgRating: 8.6,
          totalResponses: 40,
          nps: 65,
          detractors: 4,
          passives: 10,
          promoters: 26
        },
        {
          serviceName: "Massage Therapy",
          avgRating: 9.3,
          totalResponses: 30,
          nps: 85,
          detractors: 1,
          passives: 3,
          promoters: 26
        },
        {
          serviceName: "Chiropractic",
          avgRating: 7.4,
          totalResponses: 28,
          nps: 50,
          detractors: 6,
          passives: 8,
          promoters: 14
        },
        {
          serviceName: "Acupuncture",
          avgRating: 8.1,
          totalResponses: 20,
          nps: 60,
          detractors: 2,
          passives: 6,
          promoters: 12
        },
        {
          serviceName: "Sports Rehab",
          avgRating: 8.8,
          totalResponses: 22,
          nps: 70,
          detractors: 1,
          passives: 5,
          promoters: 16
        }
      ],
      highestRatedService: [
        {
          serviceName: "Massage Therapy",
          avgRating: 9.3,
          totalResponses: 30,
          nps: 85,
          detractors: 1,
          passives: 3,
          promoters: 26
        },
        {
          serviceName: "Sports Rehab",
          avgRating: 8.8,
          totalResponses: 22,
          nps: 70,
          detractors: 1,
          passives: 5,
          promoters: 16
        }
      ],
      highestResponseService: [
        {
          serviceName: "Physiotherapy",
          avgRating: 8.6,
          totalResponses: 40,
          nps: 65,
          detractors: 4,
          passives: 10,
          promoters: 26
        },
        {
          serviceName: "Massage Therapy",
          avgRating: 9.3,
          totalResponses: 30,
          nps: 85,
          detractors: 1,
          passives: 3,
          promoters: 26
        }
      ],
      histogramDataSet: [
        { value: 0, count: 0 },
        { value: 1, count: 0 },
        { value: 2, count: 1 },
        { value: 3, count: 1 },
        { value: 4, count: 2 },
        { value: 5, count: 3 },
        { value: 6, count: 4 },
        { value: 7, count: 6 },
        { value: 8, count: 8 },
        { value: 9, count: 10 },
        { value: 10, count: 12 }
      ]
    }
  };
  
import { StaffDashboardProps } from "./types";

export const staffCommentsGridData: StaffDashboardProps = {
    resource: {
      staffComments: [
        {
          staffId: "staff-001",
          staffName: "Alice Johnson",
          profileImgUrl: "https://i.pravatar.cc/150?img=1",
          date: "2025-04-01",
          service: "Physiotherapy",
          site: "Leeds Clinic",
          rating: 9,
          comment: "Alice was fantastic, really friendly and helpful.",
          clientName: "John Smith"
        },
        {
          staffId: "staff-002",
          staffName: "Ben Carter",
          profileImgUrl: "https://i.pravatar.cc/150?img=2",
          date: "2025-04-03",
          service: "Occupational Therapy",
          site: "Manchester Centre",
          rating: 6,
          comment: "Ben was okay, but seemed rushed.",
          clientName: "Laura Palmer"
        },
        {
          staffId: "staff-001",
          staffName: "Alice Johnson",
          profileImgUrl: "https://i.pravatar.cc/150?img=1",
          date: "2025-04-05",
          service: "Rehabilitation",
          site: "Leeds Clinic",
          rating: 10,
          comment: "Absolutely brilliant!",
          clientName: "James Lee"
        }
      ],
      staffStats: [
        {
          staffId: "staff-001",
          staffName: "Alice Johnson",
          profileImgUrl: "https://i.pravatar.cc/150?img=1",
          avgRating: 9.5,
          totalResponses: 20
        },
        {
          staffId: "staff-002",
          staffName: "Ben Carter",
          profileImgUrl: "https://i.pravatar.cc/150?img=2",
          avgRating: 7.2,
          totalResponses: 15
        },
        {
          staffId: "staff-003",
          staffName: "Clara Evans",
          profileImgUrl: "https://i.pravatar.cc/150?img=3",
          avgRating: 8.4,
          totalResponses: 12
        }
      ],
      highestRatedStaff: [
        {
          staffId: "staff-001",
          staffName: "Alice Johnson",
          profileImgUrl: "https://i.pravatar.cc/150?img=1",
          avgRating: 9.5,
          totalResponses: 20
        },
        {
          staffId: "staff-003",
          staffName: "Clara Evans",
          profileImgUrl: "https://i.pravatar.cc/150?img=3",
          avgRating: 8.4,
          totalResponses: 12
        }
      ],
      highestResponseStaff: [
        {
          staffId: "staff-001",
          staffName: "Alice Johnson",
          profileImgUrl: "https://i.pravatar.cc/150?img=1",
          avgRating: 9.5,
          totalResponses: 20
        },
        {
          staffId: "staff-002",
          staffName: "Ben Carter",
          profileImgUrl: "https://i.pravatar.cc/150?img=2",
          avgRating: 7.2,
          totalResponses: 15
        }
      ],
      histogramDataSet: [
        { value: 0, count: 0 },
        { value: 1, count: 0 },
        { value: 2, count: 1 },
        { value: 3, count: 0 },
        { value: 4, count: 0 },
        { value: 5, count: 2 },
        { value: 6, count: 3 },
        { value: 7, count: 2 },
        { value: 8, count: 5 },
        { value: 9, count: 6 },
        { value: 10, count: 7 }
      ]
    }
  };
  
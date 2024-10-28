import { createContext, ReactNode, useContext } from "react";

export interface UserContextProps {
  userId: number;
  userUniqueId: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  siteId?: number;
  siteName?: string;
  remoteWorker?: boolean;
  departmentId?: number;
  deptName?: string;
  teamId?: number;
  teamName?: string;
  jobLevelId?: number;
  jobLevel?: string;
  contractTypeId?: number;
  contractType?: string;
  employStartDate?: string;
  userIsActive?: boolean;
  customerId?: number;
  customerName?: string;
  customerCode?: string;
  customerType?: string;
  webAddress?: string;
  noOfUsers?: number;
  noOfSites?: number;
  businessTypeId?: number;
  businessTypeName?: string;
  sectorId?: number;
  sectorName?: string;
  regionId?: number;
  regionName?: string;
  companySizeId?: number;
  companyNo?: string;
  numberOfEmployees?: number;
  multiSite?: boolean;
  customerParentId?: number | null;
  customerParentName?: string | null;
  customerIsActive?: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component to wrap the layout and pages
export const UserProvider: React.FC<{
  value: UserContextProps;
  children: ReactNode;
}> = ({ value, children }) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

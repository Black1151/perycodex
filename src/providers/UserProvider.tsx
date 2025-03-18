"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFetchClient } from "@/hooks/useFetchClient";

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
  userImageUrl?: string;
  custImageUrl?: string;
  customerUniqueId?: string;
  teamManagerCount?: number;
  parentCustImageUrl?: string;
}

interface UserProviderProps {
  user: UserContextProps | null;
  showDeveloperBoard: boolean;
  updateShowDeveloperBoard: (value: boolean) => void;
}

const UserContext = createContext<UserProviderProps | undefined>(undefined);

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
  value?: UserContextProps;
  children: ReactNode;
}> = ({ value, children }) => {
  const [user, setUser] = useState<UserContextProps | null>(value || null);
  const [showDeveloperBoard, setShowDeveloperBoard] = useState<boolean>(false);
  const { fetchClient } = useFetchClient();

  useEffect(() => {
    // Update the user context when `value` (userMetadata) changes
    if (value) {
      setUser(value);
    }
  }, [value]);

  const getUserMetadata = async (): Promise<void> => {
    try {
      const res = await fetchClient(`/api/user/getUserMetadata`);
      setUser(res as UserContextProps); // Explicitly casting response as UserContextProps
    } catch (error) {
      console.error("Error fetching user metadata:", error);
    }
  };

  const updateShowDeveloperBoard = (value: boolean): void => {
    setShowDeveloperBoard(value);
  };

  return (
    <UserContext.Provider
      value={{ user, showDeveloperBoard, updateShowDeveloperBoard }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

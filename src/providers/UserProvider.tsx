import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useFetchClient} from "@/hooks/useFetchClient";

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
}

interface UserProviderProps {
    user: UserContextProps | null;
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
    children: ReactNode;
}> = ({children}) => {
    const [user, setUser] = useState<UserContextProps | null>(null);
    const {fetchClient} = useFetchClient();

    const getUserMetadata = async (): Promise<void> => {
        try {
            const res = await fetchClient(`/api/user/getUserMetadata`);
            setUser(res as UserContextProps); // Explicitly casting response as UserContextProps
        } catch (error) {
            console.error("Error fetching user metadata:", error);
        }
    };

    useEffect(() => {
        const fetchUserMetadata = async () => {
            if (!user) {
                await getUserMetadata();
            }
        }
        fetchUserMetadata();
    }, [])

    return (
        <UserContext.Provider value={{user}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

import { createContext, ReactNode, useContext } from "react";

interface UserContextProps {
    userFirstName: string;
    userImageUrl: string;
    userRole: string;
    userCustomerId: number | null; // Make sure this matches the type from AdminLayoutProps
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
export const UserProvider: React.FC<{ value: UserContextProps; children: ReactNode }> = ({ value, children }) => {
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

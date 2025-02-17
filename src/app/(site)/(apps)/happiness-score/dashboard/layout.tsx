import React from 'react';
import ToolDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/ToolDashboardLayout";

const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <ToolDashboardLayout/>
            {children}
        </>
    );
};

export default Layout;
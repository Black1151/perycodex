"use client";

import {VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {PerygonContainer} from "@/components/layout/PerygonContainer";
import {Footer} from "@/components/layout/Footer";
import {NavBar, NavBarProps} from "../../NavBar";
import {Tool} from "@/types/types";
import BusinessScoreSplashScreen from "./BusinessScoreSplashScreen";
import {LeftHandNavigationDrawer} from "@/components/layout/LeftHandNavigationDrawer";
import {RightHandNavigationDrawer} from "@/components/layout/RightHandNavigationDrawer";

interface HappinessScoreClientInnerProps {
    navBarProps: NavBarProps;
    toolData: Tool;
}

export default function BusinessScoreClientInner({
                                                     navBarProps,
                                                 }: HappinessScoreClientInnerProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 6000);
    }, []);

    return (
        <>
            <PerygonContainer>
                {isLoading ? (
                    <BusinessScoreSplashScreen/>
                ) : (
                    <>
                        <VStack minH="100vh">
                            <NavBar {...navBarProps} />
                        </VStack>
                        <LeftHandNavigationDrawer/>
                        <RightHandNavigationDrawer/>
                    </>
                )}
            </PerygonContainer>
            <Footer/>
        </>
    );
}

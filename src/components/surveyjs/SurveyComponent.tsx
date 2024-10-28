'use client';

import React, {useEffect, useMemo} from 'react';
import 'survey-core/defaultV2.css';
import DefaultLayout from '@/components/surveyjs/layout/default/Layout';
import HappinessLayout from "@/components/surveyjs/layout/happiness/Layout";
import {LayoutProps, SurveyComponentProps} from '@/components/surveyjs/SurveyProps';
import useSurvey from '@/components/surveyjs/useSurvey';
import useSurveySubmission from "@/components/surveyjs/useSurveySubmission";
import {Flex, Spinner} from "@chakra-ui/react";
import {useUser} from "@/providers/UserProvider";

type LayoutMap = {
    [key: string]: React.FC<LayoutProps>;
}

type Role = 'CU' | 'CL' | 'CS' | 'CA' | 'PA' | 'EU';

const SurveyComponent: React.FC<SurveyComponentProps> = ({
                                                             surveyJson,
                                                             layout = 'default',
                                                             layoutOptions,
                                                             endpoint,
                                                             isNew,
                                                             dataset,
                                                             rolesCanEdit = ['CU', 'CL', 'CS', 'CA', 'PA', 'EU'],
                                                             onSurveySuccess,
                                                             onSurveyFailure,
                                                             reloadPageOnSuccess,
                                                             includeVariables,
                                                             excludeKeys,
                                                             redirectUrl,
                                                             cssPath,
                                                             sjsPath,
                                                             jsPath,
                                                         }) => {
    const {user} = useUser();

    const canEdit = rolesCanEdit?.includes(user?.role as Role)

    // Memoize the updated surveyJson based on the layout
    const updatedSurveyJson = useMemo(() => {
        if (layout === 'default') {
            const defaultSurveyOptions = {
                widthMode: "responsive",
                fitToContainer: true,
                showQuestionNumbers: false,
                questionErrorLocation: "bottom",
                focusOnFirstError: true,
                checkErrorsMode: "onValueChanged",
                backgroundOpacity: 0,
                showNavigationButtons: false,
                showCompletedPage: false,
                showPageTitles: false
            };

            return {
                ...surveyJson,
                ...defaultSurveyOptions
            };
        }

        return surveyJson;
    }, [layout, surveyJson]);

    // Create the first instance of the survey
    const {model, isLoading} = useSurvey({
        surveyJson: updatedSurveyJson,
        isNew: isNew,
        dataset: dataset,
        includeVariables: includeVariables,
        cssPath: cssPath,
        sjsPath: sjsPath,
        jsPath: jsPath
    });

    // Add the events to what happens on submission of survey
    useSurveySubmission({
        model: model,
        isNew: isNew,
        endpoint: endpoint,
        redirectUrl: redirectUrl,
        excludeKeys: excludeKeys,
        onSurveySuccess: onSurveySuccess,
        onSurveyFailure: onSurveyFailure,
        reloadPageOnSuccess: reloadPageOnSuccess
    });

    // Dynamically load CSS file and remove it when the component unmounts
    useEffect(() => {
        let linkElement: HTMLLinkElement | null = null;

        if (!cssPath) {
            const cssHref = `/cssPath/admin.css`;
            // Create a link element and append it to the head
            linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = cssHref;
            document.head.appendChild(linkElement);
        }

        if (cssPath) {
            // Build the correct path for the CSS file inside the public folder
            const cssHref = `/cssPath/${cssPath}.css`;
            // Create a link element and append it to the head
            linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = cssHref;
            document.head.appendChild(linkElement);
        }

        return () => {
            // Clean up and remove the CSS file when component unmounts
            if (linkElement) {
                document.head.removeChild(linkElement);
            }
        };
    }, [cssPath]);

    const layoutMap: LayoutMap = {
        default: DefaultLayout,
        happiness: HappinessLayout,
    };

    const SurveyLayout = layoutMap[layout];

    if (isLoading || !model) {
        return (
            <Flex justifyContent="center" alignItems="center">
                <Spinner color={'white'}/>
            </Flex>);
    }

    return <SurveyLayout model={model} dataset={dataset} canEdit={canEdit} {...layoutOptions}/>;
};

export default SurveyComponent;

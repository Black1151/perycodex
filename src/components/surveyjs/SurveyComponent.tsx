'use client';

import React from 'react';
import 'survey-core/defaultV2.css';
import Layout from '@/components/surveyjs/layout/default/Layout';
import {LayoutProps, SurveyComponentProps} from '@/components/surveyjs/SurveyProps';
import useSurvey from '@/components/surveyjs/useSurvey';
import useSurveySubmission from "@/components/surveyjs/useSurveySubmission"; // Import the custom hook

type LayoutMap = {
    [key: string]: React.FC<LayoutProps>;
}

const SurveyComponent: React.FC<SurveyComponentProps> = ({
                                                             surveyJson,
                                                             layout = 'default',
                                                             endpoint,
                                                             isNew,
                                                             dataset,
                                                             title,
                                                             onSurveyComplete,
                                                             excludeKeys,
                                                             redirectUrl,
                                                             cssPath,
                                                             sjsPath,
                                                         }) => {
    // Create the first instance of the survey
    const {model} = useSurvey({
        surveyJson: surveyJson,
        isNew: isNew,
        dataset: dataset,
    });

    // Add the events to what happens on submission of survey
    useSurveySubmission({
        model: model,
        isNew: isNew,
        endpoint: endpoint,
        redirectUrl: redirectUrl,
        excludeKeys: excludeKeys,
        onSurveyComplete: onSurveyComplete
    });

    const layoutMap: LayoutMap = {
        default: Layout,
    };

    const SurveyLayout = layoutMap[layout];

    // Ensure model is not null before rendering
    if (!model) {
        return <div>Loading Survey...</div>; // Loading state
    }

    return <SurveyLayout model={model} dataset={dataset}/>;
};

export default SurveyComponent;

'use client';

import React, {useState} from 'react';
import AdminLayout from "@/components/surveyJS/layouts/AdminLayout";
import UserLayout from "@/components/surveyJS/layouts/UserLayout"; // Example additional layout
import useSurvey from "@/components/surveyJS/useSurvey";
import "survey-core/defaultV2.min.css";
import {useAuth} from "@/contexts/AuthContext";

interface SurveyJsComponentProps {
    jsonSchema: any;
    endpoint: string;
    isNew: boolean;
    dataset?: Record<string, any>;
    title?: string;
    layout?: string;
    onSurveyComplete?: () => void;
    excludeKeys?: string[];
    redirectUrl?: string;
    userTypeIdAllowedToEdit?: number[];
    userAllowedToEditCheck?: () => boolean;

}

const SurveyJsComponent: React.FC<SurveyJsComponentProps> = ({
                                                                 jsonSchema,
                                                                 endpoint,
                                                                 isNew,
                                                                 dataset,
                                                                 title,
                                                                 layout = 'admin',
                                                                 onSurveyComplete,
                                                                 excludeKeys,
                                                                 redirectUrl,
                                                                 userTypeIdAllowedToEdit,
                                                                 userAllowedToEditCheck,
                                                             }) => {
    const {user} = useAuth();

    const [isEditing, setIsEditing] = useState<boolean>(isNew);

    // Combine the userTypeIdAllowedToEdit and userAllowedToEditCheck to determine if user can edit
    const canEdit = (() => {
        // If userTypeIdAllowedToEdit is provided, check if the user is allowed based on type
        const userTypeIdCheck = userTypeIdAllowedToEdit && userTypeIdAllowedToEdit.length > 0
            ? userTypeIdAllowedToEdit.includes(user!.userTypeId)
            : true; // If no restrictions, allow by default

        // Check the userAllowedToEditCheck function if it's provided
        const userAllowedCheck = userAllowedToEditCheck ? userAllowedToEditCheck() : true;

        // Both checks need to pass for the user to edit
        return userTypeIdCheck && userAllowedCheck;
    })();

    // Initialize the survey model and navigation controls
    const {
        survey,
        pageNo,
        setPageNo,
        pageListOptions,
        prevPage,
        nextPage,
        jumpToPage,
        submitForm,
        cancelForm,
        handleToggleEdit,
        PageList,
        PageSelector,
    } = useSurvey({
        jsonSchema: jsonSchema,
        isEditing: isEditing,
        setIsEditing: setIsEditing,
        isNew: isNew,
        endpoint: endpoint,
        dataset: dataset,
        onSurveyComplete: onSurveyComplete,
        excludeKeys: excludeKeys,
        redirectUrl: redirectUrl,
    });


    // LayoutComponent will be assigned based on the layout prop
    let LayoutComponent;

    // Using switch statement to conditionally assign layout and props
    switch (layout) {
        case "admin":
            LayoutComponent = AdminLayout;
            break;
        case "user":
            LayoutComponent = UserLayout;
            break;
        default:
            LayoutComponent = AdminLayout; // Default fallback layout if no valid layout is provided
            break;
    }

    // Return the selected layout and pass the survey and isEditing props
    return (
        <LayoutComponent
            survey={survey}
            isEditing={isEditing}
            isNew={isNew}
            setIsEditing={setIsEditing}
            title={title}
            pageNo={pageNo}
            setPageNo={setPageNo}
            prevPage={prevPage}
            nextPage={nextPage}
            jumpToPage={jumpToPage}
            submitForm={submitForm}
            cancelForm={cancelForm}
            handleToggleEdit={handleToggleEdit}
            canEdit={canEdit}
            PageList={PageList}
            PageSelector={PageSelector}
            pageListOptions={pageListOptions}
        />
    );
};

export default SurveyJsComponent;

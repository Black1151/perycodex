"use client";

import React, {useState} from "react";
import AdminLayout from "@/components/surveyJs/layouts/AdminLayout";
import useSurvey from "@/components/surveyJs/useSurvey";
import "survey-core/defaultV2.min.css";


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
    cssPath?: string;
    sjsPath?: string;
}

const SurveyJsComponent: React.FC<SurveyJsComponentProps> = ({
                                                                 jsonSchema,
                                                                 endpoint,
                                                                 isNew,
                                                                 dataset,
                                                                 title,
                                                                 layout = "admin",
                                                                 onSurveyComplete,
                                                                 excludeKeys,
                                                                 redirectUrl,
                                                                 userTypeIdAllowedToEdit,
                                                                 userAllowedToEditCheck,
                                                                 cssPath,
                                                                 sjsPath,
                                                             }) => {
    const user = {
        userTypeId: 1,
    };

    const [isEditing, setIsEditing] = useState<boolean>(isNew);

    // Combine the userTypeIdAllowedToEdit and userAllowedToEditCheck to determine if user can edit
    const canEdit = (() => {
        // If userTypeIdAllowedToEdit is provided, check if the user is allowed based on type
        const userTypeIdCheck =
            userTypeIdAllowedToEdit && userTypeIdAllowedToEdit.length > 0
                ? userTypeIdAllowedToEdit.includes(user!.userTypeId)
                : true; // If no restrictions, allow by default

        // Check the userAllowedToEditCheck function if it's provided
        const userAllowedCheck = userAllowedToEditCheck
            ? userAllowedToEditCheck()
            : true;

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
        cssPath: cssPath,
        sjsPath: sjsPath,
    });


    // Return the selected layout and pass the survey and isEditing props
    return (
        <AdminLayout
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
            pageListOptions={pageListOptions}
        />
    );
};

export default SurveyJsComponent;

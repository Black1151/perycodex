import {ITheme, SurveyModel} from "survey-core";

type Role = 'CU' | 'CL' | 'CS' | 'CA' | 'PA' | 'EU';

export interface SurveyComponentProps {
    surveyJson: any;
    endpoint: string;
    isNew: boolean;
    layout?: string;
    layoutOptions?: Record<string, any>;
    formSubmission?: 'admin' | 'workflow',
    dataset?: Record<string, any>;
    rolesCanEdit?: Role[];
    onSurveySuccess?: () => void;
    onSurveyFailure?: () => void;
    reloadPageOnSuccess?: boolean;
    includeVariables?: Array<{ [key: string]: { [nestedKey: string]: any } }>;
    excludeKeys?: string[];
    redirectUrl?: string;
    cssPath?: string;
    sjsPath?: string;
    jsPath?: string;
}

export interface LayoutProps {
    model: any;
    dataset: any;
    canEdit: boolean;
}

export interface DefaultLayoutProps extends LayoutProps {
    showTopNavigation?: boolean;
    showBottomNavigation?: boolean;
}

export interface HappinessLayoutProps extends LayoutProps {
    showTitle?: boolean
}

export interface UseSurveyProps {
    surveyJson: any;   // You can replace `any` with a more specific type if you have one for your survey JSON structure
    isNew: boolean;    // Flag to indicate if the survey is new
    dataset?: any;     // Optional dataset, you can specify the type if you have a specific structure
    includeVariables?: Array<{ [key: string]: { [nestedKey: string]: any } }>;
    cssPath?: string;
    sjsPath?: string;
    jsPath?: string;
}

export interface UseSurveySubmissionProps {
    model: SurveyModel | null;
    formSubmission: 'admin' | 'workflow',
    isNew: boolean; // Determines whether to use POST or PUT
    endpoint: string; // API endpoint to send the data
    excludeKeys?: string[]; // Keys to exclude from submission data
    onSurveySuccess?: () => void; // Callback after successful completion
    onSurveyFailure?: () => void; // Callback after failure
    redirectUrl?: string; // URL to redirect after completion
    reloadPageOnSuccess?: boolean
}

export interface NavigationProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    jumpToPage: (page: any) => void; // Adjust 'any' to the proper type (like PageModel) if necessary
    submitSurvey: () => void;
    canEdit?: boolean;
    cancelSurvey: () => void;
    switchToDisplayMode: () => void;
    switchToEditMode: () => void;
    pageListOptions: Array<any>; // Adjust 'any' to the type of your pages if necessary
    isFirstPage: boolean;
    isLastPage: boolean;
    isEditing: boolean;
    isSubmitting: boolean;
}

export interface ThemeModule {
    themeJson: ITheme
}

export interface JsModule {
    applyJsWithoutSurvey?: () => void;
    applyJsWithSurvey?: (survey: SurveyModel) => void;
}
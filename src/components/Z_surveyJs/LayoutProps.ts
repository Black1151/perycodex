import {SurveyModel} from "survey-core"

interface PageOption {
    name: string;
    index: number;
}

export interface LayoutProps {
    survey: SurveyModel;
    title?: string;
    isEditing: boolean;
    isNew: boolean;
    setIsEditing: (value: boolean) => void;
    pageNo: number;
    setPageNo: (value: number) => void;
    jumpToPage: (value: number) => void;
    prevPage: () => void;
    nextPage: () => void;
    submitForm: () => void;
    cancelForm: () => void;
    handleToggleEdit: () => void;
    canEdit: boolean;
    pageListOptions: PageOption[];
}
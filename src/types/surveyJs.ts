import { ITheme, SurveyModel } from "survey-core";
import { Role } from "@/types/user";

export type SurveyLayoutType =
  | "default"
  | "happiness"
  | "enps"
  | "client-satisfaction"
  | "tester";
export type SurveySubmissionType = "admin" | "workflow";

export interface SurveyComponentProps {
  surveyJson: any;
  endpoint: string;
  isNew: boolean;
  layout: SurveyLayoutType;
  layoutOptions?: Record<string, any>;
  formSubmission?: SurveySubmissionType;
  dataset?: Record<string, any>;
  rolesCanEdit?: Role[];
  onSurveySuccess?: () => void;
  surveySuccessMessage?: string;
  onSurveyFailure?: () => void;
  reloadPageOnSuccess?: boolean;
  includeVariables?: Array<{ [key: string]: { [nestedKey: string]: any } }>;
  excludeKeys?: string[];
  redirectUrl?: string;
  cssPath?: string;
  sjsPath?: string;
  jsPath?: string;
  onSubmissionResponse?: (response: SubmissionResponse) => void;
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
  showTitle?: boolean;
}

export interface eNPSLayoutProps extends LayoutProps {}

export interface ClientSatisfactionLayoutProps extends LayoutProps {
  saveAllowed?: boolean;
  allowAlwaysEdit?: boolean;
}

export interface UseSurveyProps {
  surveyJson: any;
  isNew: boolean;
  dataset?: any;
  includeVariables?: Array<{ [key: string]: { [nestedKey: string]: any } }>;
  sjsPath?: string;
  jsPath?: string;
}

export interface UseSurveySubmissionProps {
  model: SurveyModel | null;
  formSubmission: SurveySubmissionType;
  isNew: boolean;
  endpoint: string;
  excludeKeys?: string[];
  onSurveySuccess?: () => void;
  surveySuccessMessage?: string;
  onSurveyFailure?: () => void;
  redirectUrl?: string;
  reloadPageOnSuccess?: boolean;
  isAnonymousSubmission?: boolean;
  onSubmissionResponse?: (response: SubmissionResponse) => void;
}

export interface NavigationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  jumpToPage: (page: any) => void;
  submitSurvey: () => void;
  canEdit?: boolean;
  cancelSurvey: () => void;
  switchToDisplayMode: () => void;
  switchToEditMode: () => void;
  pageListOptions: Array<any>;
  isFirstPage: boolean;
  isLastPage: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
}

export interface ThemeModule {
  themeJson: ITheme;
}

export interface JsModule {
  applyJsWithoutSurvey?: () => void;
  applyJsWithSurvey?: (survey: SurveyModel) => void;
}

export type SubmissionResponse = {
  success: boolean;
  message?: string;
  data?: Record<string, any>;
};

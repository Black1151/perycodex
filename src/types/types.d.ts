export interface UserIdentity {
  userId: number;
  userUniqueId: string;
  customerId: number;
  customerUniqueId: string;
  customerImageUrl: string;
  role: string;
  firstName: string;
  lastname: string;
  userAccessGroups: (string | null)[];
  department: string | null;
  team: string | null;
  userImageUrl: string | null;
}

export interface Tool {
  toolId: number;
  customerId: number;
  customerUniqueId: string;
  isActive: boolean;
  subStartDate: string;
  name: string;
  displayName: string;
  description: string;
  previewText: string;
  showInSeeMoreList: boolean;
  iconImageUrl: string;
  thumbnailImageUrl: string;
  previewImageUrl: string;
  logoImageUrl: string;
  appUrl: string;
  toolCat: string;
  toolWfId: number;
  toolWfReadOnly: boolean;
  startInUi: boolean;
}

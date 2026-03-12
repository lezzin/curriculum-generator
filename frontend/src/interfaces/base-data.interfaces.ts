export type UserBaseType = 'resume' | 'freelance-proposal';

export interface UserBaseDataItem {
  id: string;
  type: UserBaseType;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

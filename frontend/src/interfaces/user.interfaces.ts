export interface User {
  id: string;
  name: string;
  email: string;
  picture: string | null;
  onlyProvider: boolean;
  isAdmin: boolean;
}

export interface UserConfig {
  id?: string;
  userId?: string;
  linkedin: string;
  github: string;
  portfolio: string;
  cellphone: string;
}

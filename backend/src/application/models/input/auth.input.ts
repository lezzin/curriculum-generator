export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  refresh_token: string;
}

export interface SetPasswordInput {
  userId: string;
  password: string;
}

export interface SocialLoginInput {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  picture: string;
}

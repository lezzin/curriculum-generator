type AuthTokenType = 'refresh_token' | 'access_token'

export interface AuthUserData {
    sub: string
    email: string,
    type: AuthTokenType,
}
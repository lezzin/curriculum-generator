export interface GetUserOutput {
    id: string
    name: string
    email: string
    picture?: string | null
    onlyProvider: boolean
}
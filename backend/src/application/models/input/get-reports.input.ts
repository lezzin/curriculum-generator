export interface GetReportsInput {
    page: number;
    limit: number;
    userId: string;
    initialDateCreation: string;
    finalDateCreation: string;
}
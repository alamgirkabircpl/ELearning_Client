export interface PaginatedResponse<T> {
    pageNumber: number;
    pageSize: number;
    succeded: boolean;
    message: string | null;
    errors: any;
    data: T[];
}

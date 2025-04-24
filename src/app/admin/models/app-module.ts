export interface ApplicationModule {
    uid: string;
    moduleId: number;
    name: string;
}

export interface PaginatedModules {
    pageNumber: number;
    pageSize: number;
    succeeded: boolean;
    message: string | null;
    errors: any | null;
    data: ApplicationModule[];
}

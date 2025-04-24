export interface Permission {
    uid: string;
    permissionId: number;
    name: string;
}

export interface PaginatedPermissions {
    pageNumber: number;
    pageSize: number;
    succeeded: boolean;
    message: string | null;
    errors: any | null;
    data: Permission[];
}

export interface Role {
    roleId: string;
    roleName: string;
}

export interface PaginatedRoles {
    data: Role[];
    total: number;
    page: number;
    pageSize: number;
}

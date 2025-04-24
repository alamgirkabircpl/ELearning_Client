export interface Course {
    uid?: string; // GUID for API (maps to 'id' in API)
    courseId?: number;
    courseTitle: string;
    description: string;
    logo?: string;
    courseCategoryId: number;
    startDate: string | Date;
    endDate: string | Date;
    isVisible: boolean;
    file?: File;
}

export interface PaginatedCourses {
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    succeeded: boolean;
    message: string | null;
    errors: any[] | null;
    data: Course[];
}

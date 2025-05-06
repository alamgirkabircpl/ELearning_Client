export interface Course {
    uid?: string; // GUID for API (maps to 'id' in API)
    courseId?: number;
    courseTitle: string;
    description: string;
    logo?: string;
    courseCategoryId: number;
    startDate: string | Date;
    endDate: string | Date;
    startTime: string | Date;
    endTime: string | Date;
    isVisible: boolean;
    isFreeCourse: boolean;
    isOnLine: boolean;
    internal: boolean;
    coursePrice: number;
    discount: number;
    selectedDays: string[];
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

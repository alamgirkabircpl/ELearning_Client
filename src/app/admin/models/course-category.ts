export interface CourseCategory {
    uid?: string; // GUID for API (maps to 'id' in API)
    courseCategoryId?: number; // Added this field for API compatibility
    title: string;
    description: string;
}

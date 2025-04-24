export interface AssignCourse {
    courseAssignId: number;
    courseId: number;
    instructorDetailsId: number;
    courseUrl: string[];
    price: number;
    description: string;
    isApproved: boolean;
    isPaused: boolean;
    isRejected: boolean;
    courseName: string; // Add this
    instructorName: string; // Add this
}

export interface Instructor {
    instructorDetailsId: number;
    fullName: string;
    // Add other instructor properties as needed
}

export interface Course {
    courseId: number;
    courseTitle: string;
    // Add other course properties as needed
}
export interface Page<T> {
    items: T[];
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

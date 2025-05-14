export interface Payment {
    courseFeePaymentId: number;
    enrollId: number;
    enroll: {
        enrollId: number;
        enrollDate: string;
        id: string;
        applicationUser: any;
        courseId: number;
        course: {
            courseId: number;
            courseTitle: string;
            description: string;
            price: number;
            startDate: string;
            endDate: string;
            startTime: string;
            endTime: string;
            logo: string;
            isVisible: boolean;
            isActive: boolean;
            isFreeCourse: boolean;
            isOnLine: boolean;
            internal: boolean;
            coursePrice: number;
            discount: number;
            selectedDays: any[];
            file: any;
            courseCategoryId: number;
            courseCategory: any;
            uid: string;
            createdAt: any;
            createdBy: any;
            updatedAt: any;
            updatedBy: any;
        };
    };
}

export interface Instructor {
    instructorDetailsId?: number;
    firstName: string;
    lastName: string;
    fullName?: string;
    qualification: string;
    description: string;
    experience: string;
    certification: string;
    linkdinProfile?: string;
    profilePicture?: string;
    file?: File;
    id?: string;
    isActive: boolean;
    email: string;
    userName: string;
    password?: string;
    confirmPassword?: string;
}

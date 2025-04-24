export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    email: string;
    userName: string;
    password?: string;
    confirmPassword?: string;
}

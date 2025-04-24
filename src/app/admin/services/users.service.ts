import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { ChangePassword } from '../../pages/change-password/change-password.component';
import { ResetPass } from '../../pages/reset-password/reset-password.component';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient, private apiService: ApiService) {}

    createUser(user: User): Observable<any> {
        const params = new HttpParams().set('roleName', 'BASIC');
        return this.http.post(
            this.apiService.getFullUrl(
                'api/ApplicationUser/CreateApplicationUser'
            ),
            user,
            { params }
        );
    }

    updateUser(user: User): Observable<any> {
        return this.http.put(
            this.apiService.getFullUrl('api/ApplicationUser'),
            user
        );
    }

    getUserById(id: string): Observable<User> {
        return this.http.get<User>(
            `${this.apiService.getFullUrl(
                'api/ApplicationUser/GetApplicationUserById'
            )}/${id}`
        );
    }

    getAllUser(): Observable<User> {
        return this.http.get<User>(
            `${this.apiService.getFullUrl('api/ApplicationUser')}`
        );
    }
    forgotPassword(email: string): Observable<any> {
        return this.http.post(
            this.apiService.getFullUrl('api/ApplicationUser/forgotpassword'),
            { email } // Send as an object property rather than raw email string
        );
    }
    // Service Method
    resetPassword(user: ResetPass): Observable<any> {
        return this.http.post(
            this.apiService.getFullUrl('api/ApplicationUser/ResetPassword'),
            {
                email: user.email,
                token: user.token,
                password: user.password,
                confirmPassword: user.confirmPassword,
                // Note: confirmPassword should NOT be sent to the API
            }
        );
    }

    // User Service Method
    confirmEmail(userId: string, code: string): Observable<any> {
        return this.http.get(
            this.apiService.getFullUrl(
                `api/ApplicationUser/confirm-email?userId=${userId}&code=${code}`
            )
        );
    }
    passwordChange(changePassword: ChangePassword): Observable<any> {
        return this.http.post(
            this.apiService.getFullUrl('api/ApplicationUser/changepassword'),
            {
                email: changePassword.email,
                currentPassword: changePassword.currentPassword,
                newPassword: changePassword.newPassword,
            }
        );
    }
}

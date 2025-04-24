import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly RETURN_URL_KEY = 'return_url';
    private currentUserSubject = new BehaviorSubject<any>(null);

    isRefreshing = false;
    refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
        string | null
    >(null);

    constructor(private http: HttpClient) {}

    decodeAndStoreUser(token: string): void {
        try {
            const decoded = jwtDecode(token);
            this.currentUserSubject.next(decoded);
        } catch (error) {
            console.error('Token decode error:', error);
            this.currentUserSubject.next(null);
        }
    }

    setTokens(token: string, refreshToken: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        this.decodeAndStoreUser(token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    clearTokens(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.RETURN_URL_KEY);
        this.currentUserSubject.next(null);
    }

    setReturnUrl(url: string): void {
        localStorage.setItem(this.RETURN_URL_KEY, url);
    }

    getReturnUrl(): string | null {
        const url = localStorage.getItem(this.RETURN_URL_KEY);
        localStorage.removeItem(this.RETURN_URL_KEY);
        return url;
    }

    logout(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            return this.http
                .post(
                    'https://localhost:44449/api/ApplicationUser/revoke-token',
                    { refreshToken }
                )
                .pipe(
                    catchError((err) => {
                        console.error('Logout error:', err);
                        return of(null);
                    }),
                    tap(() => this.clearTokens())
                );
        }

        this.clearTokens();
        return of(null);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    getUserRoles(): string[] {
        const user = this.getCurrentUser();
        return (
            user?.[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ] || []
        );
    }

    getUserPermissions(): string[] {
        const user = this.getCurrentUser();
        const permissionsObject = user?.Permission || {}; // 👈 Fix key name (was "permissions")

        // Handle both flat and nested formats
        if (Array.isArray(permissionsObject)) {
            return permissionsObject;
        }

        const flatPermissions = Object.values(
            permissionsObject
        ).flat() as string[];
        console.log({ user, permissionsObject, flatPermissions });
        return flatPermissions;
    }

    hasRole(role: string): boolean {
        return this.getUserRoles().includes(role);
    }

    hasPermission(permission: string): boolean {
        return this.getUserPermissions().includes(permission);
    }

    hasAnyPermission(permissions: string[]): boolean {
        return permissions.some((perm) => this.hasPermission(perm));
    }

    hasAnyRole(roles: string[]): boolean {
        return roles.some((role) => this.hasRole(role));
    }

    hasAllPermissions(permissions: string[]): boolean {
        return permissions.every((perm) => this.hasPermission(perm));
    }

    refreshAccessToken(): Observable<string> {
        const refreshToken = this.getRefreshToken();
        const token = this.getToken();

        if (!refreshToken) {
            return throwError(() => new Error('No refresh token'));
        }

        return this.http
            .post<{ token: string; refreshToken: string }>(
                'https://localhost:44449/api/ApplicationUser/refresh-token',
                {
                    refreshToken,
                    token,
                }
            )
            .pipe(
                tap((res) => this.setTokens(res.token, res.refreshToken)),
                map((res) => res.token),
                catchError((err) => {
                    this.clearTokens();
                    return throwError(() => err);
                })
            );
    }
}

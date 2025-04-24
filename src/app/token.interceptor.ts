import {
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
    catchError,
    filter,
    finalize,
    switchMap,
    take,
    throwError,
} from 'rxjs';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (req.url.includes('/login') || req.url.includes('/refresh-token')) {
        return next(req);
    }

    const token = authService.getToken();
    if (token && isTokenExpired(token)) {
        return handle401Error(req, next, authService, router);
    }

    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((error) => {
            if ([0, 401, 403].includes(error.status)) {
                return handle401Error(authReq, next, authService, router);
            }
            return throwError(() => error);
        })
    );
};

function isTokenExpired(token: string): boolean {
    try {
        const decoded: any = jwtDecode(token);
        return decoded.exp < Date.now() / 1000;
    } catch {
        return true;
    }
}

function handle401Error(
    request: HttpRequest<any>,
    next: HttpHandlerFn,
    authService: AuthService,
    router: Router
) {
    if (authService.isRefreshing) {
        return authService.refreshTokenSubject.pipe(
            filter((t) => !!t),
            take(1),
            switchMap((token) =>
                next(
                    request.clone({
                        setHeaders: { Authorization: `Bearer ${token}` },
                    })
                )
            )
        );
    }

    authService.isRefreshing = true;
    authService.refreshTokenSubject.next(null);

    return authService.refreshAccessToken().pipe(
        switchMap((token) => {
            authService.refreshTokenSubject.next(token);
            return next(
                request.clone({
                    setHeaders: { Authorization: `Bearer ${token}` },
                })
            );
        }),
        catchError((err) => {
            authService.clearTokens();
            router.navigate(['/login'], {
                queryParams: { sessionExpired: true },
            });
            return throwError(() => err);
        }),
        finalize(() => {
            authService.isRefreshing = false;
        })
    );
}

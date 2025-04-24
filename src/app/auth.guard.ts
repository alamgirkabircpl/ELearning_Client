import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, from, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const token = authService.getToken();
    if (!token) {
        return redirectToLogin(router, state.url);
    }

    try {
        const decoded: any = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;
        if (isExpired) {
            return handleExpiredToken(authService, router, state.url, route);
        }

        authService.decodeAndStoreUser(token);

        if (state.url === '/dashboard' && authService.hasRole('BASIC')) {
            return router.parseUrl('/admin/dashboard');
        }

        const requiredRoles = route.data?.['roles'] as string[];
        if (requiredRoles && !authService.hasAnyRole(requiredRoles)) {
            return router.parseUrl('/unauthorized');
        }

        const requiredPermissions = route.data?.['permissions'] as string[];
        if (
            requiredPermissions &&
            !authService.hasAllPermissions(requiredPermissions)
        ) {
            return router.parseUrl('/unauthorized');
        }

        return true;
    } catch {
        authService.clearTokens();
        return redirectToLogin(router, state.url);
    }
};

function handleExpiredToken(
    authService: AuthService,
    router: Router,
    returnUrl: string,
    route: any
): Observable<boolean | UrlTree> {
    return from(authService.refreshAccessToken()).pipe(
        map(() => {
            const roles = route.data?.['roles'] || [];
            const permissions = route.data?.['permissions'] || [];
            if (roles.length && !authService.hasAnyRole(roles))
                return router.parseUrl('/unauthorized');
            if (
                permissions.length &&
                !authService.hasAllPermissions(permissions)
            )
                return router.parseUrl('/unauthorized');
            return true;
        }),
        catchError(() => {
            authService.clearTokens();
            return of(redirectToLogin(router, returnUrl));
        })
    );
}

function redirectToLogin(router: Router, returnUrl: string): UrlTree {
    if (returnUrl !== '/login') {
        localStorage.setItem('returnUrl', returnUrl);
    }
    return router.parseUrl('/login?sessionExpired=true');
}

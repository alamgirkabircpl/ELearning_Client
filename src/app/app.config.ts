import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    ApplicationConfig,
    importProvidersFrom,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { AuthInterceptor } from './token.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        FormsModule,
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(),
        provideAnimationsAsync(),

        // With:
        provideAnimations(),
        importProvidersFrom(
            ToastrModule.forRoot({
                timeOut: 3000,
                positionClass: 'toast-top-right',
                preventDuplicates: true,
            })
        ),

        provideHttpClient(withInterceptors([AuthInterceptor])),
        // ✅ Register JwtHelperService
        JwtHelperService,
        // Provide the JWT_OPTIONS with your API's domain
        {
            provide: JWT_OPTIONS,
            useValue: {
                tokenGetter: () => localStorage.getItem('access_token'),
                allowedDomains: ['localhost:44357'], // Allowing localhost API domain
                disallowedRoutes: ['localhost:44357/auth'], // Example of disallowing login route
            },
        },
        // Register standalone directive as a provider
        HasPermissionDirective, provideAnimationsAsync(),
    ],
};

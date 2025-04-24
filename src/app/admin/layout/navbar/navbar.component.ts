import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { ToastNotificationService } from '../../../toast-notification.service';
import { UserService } from '../../services/users.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
    auth = inject(AuthService);
    isLoading: boolean = false;
    route = inject(Router);
    toast = inject(ToastNotificationService);
    userService = inject(UserService);

    logout() {
        this.auth.logout().subscribe({
            complete: () => {
                // Redirect to login with a query parameter
                this.route.navigate(['/login'], {
                    queryParams: { loggedOut: 'true' },
                });
            },
        });
        this.toast.showSuccess('You are successfully logout.');
    }
}

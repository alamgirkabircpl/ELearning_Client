import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../auth.service';
import { PlatformService } from '../../../platform.service';
import { SharedModule } from '../../../shared.module';
import { ToastNotificationService } from '../../../toast-notification.service';
import { User } from '../../models/user';
import { UserService } from '../../services/users.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        RouterLinkActive,
        SharedModule,
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
    @Input() isOpen = false;
    @Input() isMobile = false;
    @Output() toggleSidebar = new EventEmitter<void>();
    user: User | null = null;

    isConfigurationOpen = false;
    private authService = inject(AuthService);
    private toastService = inject(ToastNotificationService);
    private userService = inject(UserService);
    private platformService = inject(PlatformService);

    constructor(private router: Router, private jwtHelper: JwtHelperService) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.checkActiveRoutes();
            });
    }

    ngOnInit() {
        if (this.platformService.isBrowser()) {
            this.authService.initializeUserFromToken();
            this.getUserData();
        }
    }

    logout() {
        this.authService.logout().subscribe({
            complete: () => {
                // Redirect to login with a query parameter
                this.router.navigate(['/login'], {
                    queryParams: { loggedOut: 'true' },
                });
            },
        });
        this.toastService.showSuccess('You are successfully logout.');
    }

    onToggleSidebar() {
        this.toggleSidebar.emit();
    }

    toggleConfiguration(event: Event) {
        event.preventDefault();
        this.isConfigurationOpen = !this.isConfigurationOpen;
    }

    isConfigurationActive(): boolean {
        return this.router.url.includes('/admin/configuration');
    }

    private checkActiveRoutes() {
        if (this.isConfigurationActive()) {
            this.isConfigurationOpen = true;
        }
    }

    hasPermission(permission: string): boolean {
        const token = localStorage.getItem('auth_token');
        if (!token) return false;
        console.log('first', token);

        const decodedToken = this.jwtHelper.decodeToken(token);
        const permissions = decodedToken['Permission'] || [];
        console.log('i am perrmission', permissions, permission);
        return permissions.includes(permission);
    }

    showConfigurationMenu(): boolean {
        // Always show if base items are shown, or user has permission for others
        return (
            true ||
            this.hasPermission('View_ABC') ||
            this.hasPermission('ManageUsers')
        );
    }

    getUserData() {
        var data = this.authService.getCurrentUser();
        console.log('', data);

        if (data && data.email) {
            this.getUserByEmail(data.email);
        }
    }

    getUserByEmail(email: string) {
        this.userService.getUserByEmail(email).subscribe({
            next: (user) => {
                this.user = user;
                console.log('User data:', user);
            },
            error: (error) => {
                console.error('Error fetching user by email:', error);
            },
        });
    }
}

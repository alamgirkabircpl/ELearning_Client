import { NgClass, NgIf } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../admin/services/users.service';
import { AuthService } from '../../auth.service';
import { ToastNotificationService } from '../../toast-notification.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    userObject: any;
    isLoggedIn: boolean = false;
    isAdmin: boolean = false;
    private toastService = inject(ToastNotificationService);

    constructor(public router: Router) {}

    ngOnInit(): void {
        this.authService.initializeUserFromToken();
        this.getUserData();
    }
    // Navbar Sticky
    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition =
            window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    // Menu Trigger
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    getUserData() {
        if (this.authService.isLoggedIn()) {
            this.isLoggedIn = true;
            const user = this.authService.getCurrentUser();
            this.userObject = user;
            this.userService.getUserByEmail(user.email).subscribe({
                next: (response) => {
                    this.userObject = response;
                },
            });
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
        this.isLoggedIn = false;
        this.isAdmin = false;
    }
}

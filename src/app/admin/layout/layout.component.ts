// admin-layout.component.ts
import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ToastNotificationService } from '../../toast-notification.service';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterOutlet,
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
    ],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
    @ViewChild('enrollmentChart') chartRef!: ElementRef;
    auth = inject(AuthService);
    route = inject(Router);
    toast = inject(ToastNotificationService);
    constructor() {}

    ngOnInit(): void {
        // Initialize sidebar toggle
        this.initSidebarToggle();
    }

    ngAfterViewInit(): void {}

    private initSidebarToggle(): void {
        const menuToggle = document.getElementById('menu-toggle');
        const wrapper = document.getElementById('wrapper');

        if (menuToggle && wrapper) {
            menuToggle.addEventListener('click', () => {
                wrapper.classList.toggle('toggled');
            });
        }
    }

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

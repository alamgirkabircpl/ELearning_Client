import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent {
    enrollsCount = 120;
    coursesCount = 45;
    instructorsCount = 10;
    totalPayments = 24000;
    visitCount = 3200;
}

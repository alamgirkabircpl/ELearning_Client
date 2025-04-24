import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent {
    authService = inject(AuthService);

    columns = [
        { name: 'Name', prop: 'name', width: 200 },
        { name: 'Position', prop: 'position', width: 250 },
        { name: 'Office', prop: 'office', width: 150 },
        {
            name: 'Status',
            prop: 'status',
            width: 120,
            cellClass: (row: any) => {
                return {
                    'text-success': row.status === 'Active',
                    'text-danger': row.status === 'Inactive',
                    'text-warning': row.status === 'Pending',
                };
            },
        },
        { name: 'Start Date', prop: 'startDate', width: 150 },
    ];

    rows = [
        {
            name: 'Tiger Nixon',
            position: 'System Architect',
            office: 'Edinburgh',
            status: 'Active',
            startDate: '2023-01-01',
        },
        {
            name: 'Garrett Winters',
            position: 'Accountant',
            office: 'Tokyo',
            status: 'Active',
            startDate: '2023-02-15',
        },
        {
            name: 'Ashton Cox',
            position: 'Junior Technical Author',
            office: 'London',
            status: 'Pending',
            startDate: '2023-03-10',
        },
        {
            name: 'Cedric Kelly',
            position: 'Senior Javascript Developer',
            office: 'Edinburgh',
            status: 'Active',
            startDate: '2023-04-05',
        },
        {
            name: 'Airi Satou',
            position: 'Accountant',
            office: 'Tokyo',
            status: 'Inactive',
            startDate: '2023-01-20',
        },
        {
            name: 'Brielle Williamson',
            position: 'Integration Specialist',
            office: 'New York',
            status: 'Active',
            startDate: '2023-05-18',
        },
        {
            name: 'Herrod Chandler',
            position: 'Sales Assistant',
            office: 'San Francisco',
            status: 'Inactive',
            startDate: '2023-06-22',
        },
    ];

    onRowClick(row: any): void {
        console.log('Row clicked:', row);
        // Navigate to detail view or show modal
    }

    editEmployee(row: any): void {
        console.log('Edit:', row);
        // Open edit modal or navigate to edit page
    }

    deleteEmployee(row: any): void {
        console.log('Delete:', row);
        // Show confirmation dialog and delete
    }

    addEmployee(): void {
        console.log('Add new employee');
        // Open add modal or navigate to add page
    }

    exportToExcel(): void {
        console.log('Export to Excel');
        // Implement export functionality
    }

    get userRoles(): string[] {
        return this.authService.getUserRoles();
    }
}

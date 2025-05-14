import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Payment } from '../models/payment';
import { CommonService } from '../services/common.service';
import { CoursePaymentService } from '../services/course-payment.service';

@Component({
    selector: 'app-course-payment',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './course-payment.component.html',
    styleUrl: './course-payment.component.scss',
})
export class CoursePaymentComponent {
    enrollments: Payment[] = [];
    filteredEnrollments: Payment[] = [];
    selectedEnrollment: any = null;

    pageNumber = 1;
    pageSize = 10;
    totalItems = 0;

    searchTerm = '';
    isApprovedFilter: string = ''; // "", "true", or "false"
    commonService = inject(CommonService);

    constructor(private coursePaymentService: CoursePaymentService) {}

    ngOnInit(): void {
        this.loadEnrollments();
    }

    loadEnrollments(): void {
        this.coursePaymentService
            .getAll(this.pageNumber, this.pageSize)
            .subscribe((res) => {
                this.enrollments = res;
                this.totalItems = res.totalCount || res.length; // adjust based on backend
                this.applyFilters();
            });
    }

    applyFilters(): void {
        this.filteredEnrollments = this.enrollments.filter((item) => {
            const matchesSearch =
                !this.searchTerm ||
                item.enroll.id
                    .toLowerCase()
                    .includes(this.searchTerm.toLowerCase());

            const matchesApproval =
                this.isApprovedFilter === '' ||
                item.enroll.course.isActive.toString() ===
                    this.isApprovedFilter;

            return matchesSearch && matchesApproval;
        });
    }

    onSearchChange(): void {
        this.applyFilters();
    }

    onFilterChange(): void {
        this.applyFilters();
    }

    onPageChange(newPage: number): void {
        this.pageNumber = newPage;
        this.loadEnrollments();
    }

    edit(id: string): void {
        // navigate or open modal
        console.log('Edit ID:', id);
    }
    details(enrolobj: any) {
        // Open modal (Bootstrap 5)
        const modalElement = document.getElementById('enrollmentDetailsModal');
        if (modalElement) {
            if (enrolobj) {
                this.commonService
                    .GetEnrollDetailsByEnrollId(enrolobj.enrollId)
                    .subscribe((res) => {
                        this.selectedEnrollment = res;
                    });
            }
            const modal = new (window as any).bootstrap.Modal(modalElement);
            modal.show();
        }
    }
    delete(id: string): void {
        if (confirm('Are you sure you want to delete this enrollment?')) {
            this.coursePaymentService.delete(id).subscribe(() => {
                this.loadEnrollments();
            });
        }
    }

    get totalPages(): number[] {
        return Array.from(
            { length: Math.ceil(this.totalItems / this.pageSize) },
            (_, i) => i + 1
        );
    }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Instructor } from '../../admin/models/trainer';
import { PaymentComponent } from '../../admin/payment/payment.component';
import { CourseData } from '../courses-page/courses-page.component'; // Adjust path if necessary

@Component({
    selector: 'app-course-offcanvas',
    standalone: true,
    imports: [PaymentComponent, CommonModule],
    templateUrl: './course-offcanvas.component.html',
    styleUrl: './course-offcanvas.component.scss',
})
export class CourseOffcanvasComponent {
    @Input() course!: CourseData | null;
    @Input() instructor!: Instructor | null;
    @Input() coursePrice: number = 0;

    constructor(private sanitizer: DomSanitizer) {}

    getImagePath(path: string): string {
        if (!path) return '';
        return path.startsWith('http') ? path : `/${path}`;
    }

    getSanitizedContent(content: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(content || '');
    }

    convertTo12Hour(time?: string): string {
        if (!time || !time.includes(':')) return '';
        const [hoursStr, minutesStr] = time.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        const paddedMinutes = minutes.toString().padStart(2, '0');
        return `${hour12}:${paddedMinutes} ${ampm}`;
    }
}

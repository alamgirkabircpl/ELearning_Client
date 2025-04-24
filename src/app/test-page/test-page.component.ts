import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
    selector: 'app-test-page',
    standalone: true,
    imports: [],
    templateUrl: './test-page.component.html',
    styleUrl: './test-page.component.scss',
})
export class TestPageComponent {
    @ViewChild('enrollmentChart') chartRef!: ElementRef;
    private chart!: Chart;

    constructor() {
        Chart.register(...registerables);
    }

    ngOnInit(): void {
        // Initialize sidebar toggle
        this.initSidebarToggle();
    }

    ngAfterViewInit(): void {
        this.initChart();
    }

    private initSidebarToggle(): void {
        const menuToggle = document.getElementById('menu-toggle');
        const wrapper = document.getElementById('wrapper');

        if (menuToggle && wrapper) {
            menuToggle.addEventListener('click', () => {
                wrapper.classList.toggle('toggled');
            });
        }
    }

    private initChart(): void {
        const ctx = this.chartRef.nativeElement.getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Enrollments',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
}

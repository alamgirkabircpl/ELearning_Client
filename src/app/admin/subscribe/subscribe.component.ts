import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscribe } from '../models/subscribe';
import { SubscribeService } from '../services/subscribe.service';

@Component({
    selector: 'app-subscribe',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './subscribe.component.html',
    styleUrl: './subscribe.component.scss',
})
export class SubscribeComponent implements OnInit {
    subscribes: Subscribe[] = [];
    filteredSubscribes: Subscribe[] = [];
    paginatedSubscribes: Subscribe[] = [];
    currentSubscribe: Subscribe = this.createEmptySubscribe();
    isEditMode = false;
    searchTerm = '';

    page = 1;
    pageSize = 2;

    constructor(private subscribeService: SubscribeService) {}

    ngOnInit(): void {
        this.loadSubscribes();
    }

    createEmptySubscribe(): Subscribe {
        return {
            subscribeEmail: '',
            isResponse: false,
        };
    }

    loadSubscribes(): void {
        this.subscribeService.getAllSubscribes().subscribe((data) => {
            this.subscribes = data;
            this.filteredSubscribes = [...this.subscribes];
            this.updatePagination();
        });
    }

    saveSubscribe(): void {
        if (this.isEditMode && this.currentSubscribe.subscribeId) {
            this.subscribeService
                .updateSubscribe(
                    this.currentSubscribe.subscribeId,
                    this.currentSubscribe
                )
                .subscribe(() => {
                    this.isEditMode = false;
                    this.currentSubscribe = this.createEmptySubscribe();
                    this.loadSubscribes();
                });
        } else {
            this.subscribeService
                .createSubscribe(this.currentSubscribe)
                .subscribe(() => {
                    this.currentSubscribe = this.createEmptySubscribe();
                    this.loadSubscribes();
                });
        }
    }

    editSubscribe(subscribe: Subscribe): void {
        this.isEditMode = true;
        this.currentSubscribe = { ...subscribe };
    }

    cancelEdit(): void {
        this.isEditMode = false;
        this.currentSubscribe = this.createEmptySubscribe();
    }

    confirmDelete(id: number): void {
        if (confirm('Are you sure you want to delete this subscriber?')) {
            this.deleteSubscribe(id);
        }
    }

    deleteSubscribe(id: number): void {
        this.subscribeService.deleteSubscribe(id).subscribe(() => {
            this.loadSubscribes();
        });
    }

    searchSubscribers(): void {
        if (!this.searchTerm.trim()) {
            this.filteredSubscribes = [...this.subscribes];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredSubscribes = this.subscribes.filter((s) =>
                s.subscribeEmail.toLowerCase().includes(term)
            );
        }
        this.page = 1;
        this.updatePagination();
    }

    updatePagination(): void {
        const startIndex = (this.page - 1) * this.pageSize;
        this.paginatedSubscribes = this.filteredSubscribes.slice(
            startIndex,
            startIndex + this.pageSize
        );
    }

    onPageChange(newPage: number): void {
        if (newPage >= 1 && newPage <= this.totalPages.length) {
            this.page = newPage;
            this.updatePagination();
        }
    }

    get totalPages(): number[] {
        return Array(Math.ceil(this.filteredSubscribes.length / this.pageSize))
            .fill(0)
            .map((_, i) => i + 1);
    }

    getDisplayRange() {
        const start = (this.page - 1) * this.pageSize + 1;
        const end = Math.min(
            this.page * this.pageSize,
            this.filteredSubscribes.length
        );
        return { start, end };
    }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contact } from '../models/contact';
import { ContactService } from '../services/contact.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
    contacts: Contact[] = [];
    filteredContacts: Contact[] = [];
    paginatedContacts: Contact[] = [];
    currentContact: Contact = this.createEmptyContact();
    isEditMode = false;
    searchTerm = '';

    page = 1;
    pageSize = 2;

    constructor(private contactService: ContactService) {}

    ngOnInit(): void {
        this.loadContacts();
    }

    createEmptyContact(): Contact {
        return {
            name: '',
            email: '',
            subject: '',
            message: '',
            isResponse: false,
            isRead: false,
        };
    }

    loadContacts(): void {
        this.contactService.getAllContacts().subscribe((data) => {
            this.contacts = data;
            this.filteredContacts = [...this.contacts];
            this.updatePagination();
        });
    }

    saveContact(): void {
        if (this.isEditMode && this.currentContact.name) {
            this.contactService
                .updateContact(this.currentContact.name, this.currentContact)
                .subscribe(() => {
                    this.isEditMode = false;
                    this.currentContact = this.createEmptyContact();
                    this.loadContacts();
                });
        } else {
            this.contactService
                .createContact(this.currentContact)
                .subscribe(() => {
                    this.currentContact = this.createEmptyContact();
                    this.loadContacts();
                });
        }
    }

    editContact(contact: Contact): void {
        this.isEditMode = true;
        this.currentContact = { ...contact };
    }

    cancelEdit(): void {
        this.isEditMode = false;
        this.currentContact = this.createEmptyContact();
    }

    deleteContact(name: string): void {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contactService.deleteContact(name).subscribe(() => {
                this.loadContacts();
            });
        }
    }

    searchContacts(): void {
        if (!this.searchTerm.trim()) {
            this.filteredContacts = [...this.contacts];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredContacts = this.contacts.filter(
                (c) =>
                    c.name.toLowerCase().includes(term) ||
                    c.email.toLowerCase().includes(term)
            );
        }
        this.page = 1;
        this.updatePagination();
    }

    updatePagination(): void {
        const startIndex = (this.page - 1) * this.pageSize;
        this.paginatedContacts = this.filteredContacts.slice(
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
        const pageCount = Math.ceil(
            this.filteredContacts.length / this.pageSize
        );
        return Array(pageCount)
            .fill(0)
            .map((_, i) => i + 1);
    }

    getDisplayRange() {
        const start = (this.page - 1) * this.pageSize + 1;
        const end = Math.min(
            this.page * this.pageSize,
            this.filteredContacts.length
        );
        return { start, end };
    }
}

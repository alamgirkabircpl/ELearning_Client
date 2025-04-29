import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastNotificationService } from '../../../toast-notification.service';
import { User } from '../../models/user';
import { UserService } from '../../services/users.service';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    editingUserId: string | null = null;
    isLoading = false;
    currentPage = 1;
    itemsPerPage = 5;
    searchTerm = '';
    sortDirection: 'asc' | 'desc' = 'asc';
    sortField: string = 'firstName';
    selectedUserToDelete: User | null = null;

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private toast: ToastNotificationService
    ) {
        this.form = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            userName: ['', Validators.required],
            isActive: [true],
            password: [''],
            confirmPassword: [''],
        });
    }

    ngOnInit(): void {
        this.fetchUsers();
    }

    fetchUsers() {
        this.isLoading = true;
        this.userService.getAllUser().subscribe({
            next: (data: any) => {
                this.users = data;
                this.filteredUsers = [...this.users];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Fetch users failed', err);
                this.toast.showError('Failed to load users');
                this.isLoading = false;
            },
        });
    }

    get paginatedUsers() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredUsers.slice(start, start + this.itemsPerPage);
    }

    totalPages(): number {
        return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    }

    pageArray(): number[] {
        return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
    }

    onSearchChange() {
        const term = this.searchTerm.toLowerCase();
        this.filteredUsers = this.users.filter(
            (user) =>
                user.firstName.toLowerCase().includes(term) ||
                user.lastName.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                user.userName.toLowerCase().includes(term)
        );
        this.currentPage = 1;
    }

    changePage(page: number) {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage = page;
        }
    }

    onSubmit() {
        if (this.form.invalid) return;
        const formValue = this.form.value;

        if (this.editingUserId) {
            const updatedUser: User = {
                ...formValue,
                id: this.editingUserId,
            };
            delete updatedUser.password;
            delete updatedUser.confirmPassword;

            this.userService.updateUser(updatedUser).subscribe(() => {
                this.toast.showSuccess('User updated successfully');
                this.reloadUsers();
            });
        } else {
            this.userService.createUser(formValue).subscribe(() => {
                this.toast.showSuccess('User created successfully');
                this.reloadUsers();
            });
        }
    }

    edit(user: User) {
        this.editingUserId = user.id ?? null;
        this.form.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userName: user.userName,
            isActive: user.isActive,
            password: '',
            confirmPassword: '',
        });
    }

    resetForm() {
        this.form.reset({ isActive: true });
        this.editingUserId = null;
    }

    prepareDelete(user: User) {
        this.selectedUserToDelete = user;
    }

    confirmDelete() {
        // if (this.selectedUserToDelete) {
        //     this.userService.deleteUser(this.selectedUserToDelete.id!).subscribe(() => {
        //         this.toast.showSuccess('User deleted successfully');
        //         this.reloadUsers();
        //     });
        // }
        this.selectedUserToDelete = null;
    }

    reloadUsers() {
        this.users = [];
        this.filteredUsers = [];
        this.fetchUsers();
        this.resetForm();
    }

    sortBy(field: string) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        this.filteredUsers.sort((a: any, b: any) => {
            if (a[field] < b[field])
                return this.sortDirection === 'asc' ? -1 : 1;
            if (a[field] > b[field])
                return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    manageRole(user: User) {
        // Implement role management logic here
        console.log('Manage role for user:', user);
    }
}

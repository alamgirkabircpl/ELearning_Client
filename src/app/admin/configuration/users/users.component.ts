import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ToastNotificationService } from '../../../toast-notification.service';
import { User } from '../../models/user';
import { UserService } from '../../services/users.service';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
    private userService = inject(UserService);
    private fb = inject(FormBuilder);
    private toastNotification = inject(ToastNotificationService);

    users = signal<User[]>([]);
    editingUserId = signal<string | null>(null);
    currentPage = signal(1);
    itemsPerPage = 5;

    form: FormGroup = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        userName: ['', Validators.required],
        isActive: [false],
        password: [''],
        confirmPassword: [''],
    });

    ngOnInit(): void {
        this.fetchUsers();
    }

    get paginatedUsers() {
        const start = (this.currentPage() - 1) * this.itemsPerPage;
        return this.users().slice(start, start + this.itemsPerPage);
    }

    fetchUsers() {
        this.userService.getAllUser().subscribe({
            next: (data: any) => this.users.set(data),
            error: (err) => console.error('Fetch users failed', err),
        });
    }

    onSubmit() {
        const formValue = this.form.value;

        if (this.editingUserId()) {
            // Update
            const updatedUser: User = {
                ...formValue,
                id: this.editingUserId(),
            };
            delete updatedUser.password;
            delete updatedUser.confirmPassword;

            this.userService.updateUser(updatedUser).subscribe(() => {
                this.toastNotification.showSuccess('User updated successfully');
                this.fetchUsers();
                this.resetForm();
            });
        } else {
            // Create
            this.userService.createUser(formValue).subscribe(() => {
                this.toastNotification.showSuccess('User created successfully');
                this.fetchUsers();
                this.resetForm();
            });
        }
    }

    edit(user: User) {
        this.editingUserId.set(user.id ?? null);
        this.form.patchValue({
            ...user,
            password: '',
            confirmPassword: '',
        });
    }

    delete(user: User) {
        this.users.update((prev) => prev.filter((u) => u.id !== user.id));
    }

    resetForm() {
        this.form.reset({
            isActive: false,
        });
        this.editingUserId.set(null);
    }

    changePage(page: number) {
        this.currentPage.set(page);
    }

    totalPages(): number {
        return Math.ceil(this.users().length / this.itemsPerPage);
    }

    pageArray(): number[] {
        return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
    }

    ManagePermission(data: any) {}
}

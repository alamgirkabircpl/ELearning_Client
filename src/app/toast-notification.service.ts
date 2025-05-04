import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class ToastNotificationService {
    constructor(private toastr: ToastrService) {}

    showSuccess(msg: string) {
        console.log('I am calling');
        this.toastr.success(msg, 'Success');
    }

    showError(msg: string) {
        this.toastr.error(msg, 'Error');
    }

    showWarning(msg: string) {
        this.toastr.warning(msg, 'Warning');
    }

    showInfo(msg: string) {
        this.toastr.info(msg, 'Info');
    }
    confirm(title: string, text: string): Promise<boolean> {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => result.isConfirmed);
    }
}

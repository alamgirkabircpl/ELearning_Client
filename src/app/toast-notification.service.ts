import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

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
}

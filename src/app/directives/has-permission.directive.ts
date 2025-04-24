import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../auth.service';

@Directive({
    selector: '[hasPermission]',
})
export class HasPermissionDirective {
    constructor(
        private authService: AuthService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {}

    @Input() set hasPermission(permission: string | string[]) {
        const hasPerm = Array.isArray(permission)
            ? this.authService.hasAnyPermission(permission)
            : this.authService.hasPermission(permission);

        if (hasPerm) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}

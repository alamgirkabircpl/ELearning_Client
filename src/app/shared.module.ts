import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HasPermissionDirective } from './directives/has-permission.directive'; // adjust path

@NgModule({
    declarations: [HasPermissionDirective],
    imports: [CommonModule],
    exports: [HasPermissionDirective], // <-- this makes it usable elsewhere
})
export class SharedModule {}

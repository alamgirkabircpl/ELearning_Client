import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-material-dashboard',
    standalone: true,
    imports: [MatSlideToggleModule],
    templateUrl: './material-dashboard.component.html',
    styleUrl: './material-dashboard.component.scss',
})
export class MaterialDashboardComponent {}

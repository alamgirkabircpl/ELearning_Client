import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-mission',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './mission.component.html',
    styleUrl: './mission.component.scss'
})
export class MissionComponent {}
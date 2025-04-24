import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'E-Learning Project';
    apiUrl = inject(ApiService);

    constructor(
        private router: Router,
        private viewportScroller: ViewportScroller
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                // Scroll to the top after each navigation end
                this.viewportScroller.scrollToPosition([0, 0]);
            }
        });
    }
}

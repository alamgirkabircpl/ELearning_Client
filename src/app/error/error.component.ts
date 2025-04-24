import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent {
  returnUrl: string | null = localStorage.getItem('returnUrl');

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'];
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.returnUrl },
    });
  }
}

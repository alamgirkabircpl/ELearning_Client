import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-more-blogs',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './more-blogs.component.html',
    styleUrl: './more-blogs.component.scss'
})
export class MoreBlogsComponent {}
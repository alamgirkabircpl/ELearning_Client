import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly apiUrl = environment.apiUrl;
    constructor() {}
    getFullUrl(endpoint: string): string {
        return `${this.apiUrl}/${endpoint}`;
    }

    getImageUrl(path: string | null): string {
        return path ? `${this.apiUrl}/${path}` : 'assets/default-image.png';
    }
}

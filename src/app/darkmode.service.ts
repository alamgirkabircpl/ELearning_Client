import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private isDark = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDark.asObservable();

  constructor() {
    // Load saved preference
    const savedMode = localStorage.getItem('darkMode') === 'true';
    this.isDark.next(savedMode);
  }

  toggle() {
    const newMode = !this.isDark.value;
    this.isDark.next(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  }
}

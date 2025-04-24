import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isOpen = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpen.asObservable();

  private isMobile = new BehaviorSubject<boolean>(false);
  isMobile$ = this.isMobile.asObservable();

  toggle() {
    this.isOpen.next(!this.isOpen.value);
  }

  close() {
    this.isOpen.next(false);
  }

  setMobileState(isMobile: boolean) {
    this.isMobile.next(isMobile);
    if (!isMobile) {
      this.isOpen.next(false);
    }
  }
}

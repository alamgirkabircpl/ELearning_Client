import { TestBed } from '@angular/core/testing';

import { CoursePaymentService } from './course-payment.service';

describe('CoursePaymentService', () => {
  let service: CoursePaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursePaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

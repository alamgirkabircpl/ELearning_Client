import { TestBed } from '@angular/core/testing';

import { AssignCourseService } from './assign-course.service';

describe('AssignCourseService', () => {
  let service: AssignCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

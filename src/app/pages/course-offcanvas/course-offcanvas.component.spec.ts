import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseOffcanvasComponent } from './course-offcanvas.component';

describe('CourseOffcanvasComponent', () => {
  let component: CourseOffcanvasComponent;
  let fixture: ComponentFixture<CourseOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseOffcanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

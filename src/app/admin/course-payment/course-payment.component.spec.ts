import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePaymentComponent } from './course-payment.component';

describe('CoursePaymentComponent', () => {
  let component: CoursePaymentComponent;
  let fixture: ComponentFixture<CoursePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

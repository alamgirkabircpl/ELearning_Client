import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentDetailsModalComponent } from './enrolment-details-modal.component';

describe('EnrolmentDetailsModalComponent', () => {
  let component: EnrolmentDetailsModalComponent;
  let fixture: ComponentFixture<EnrolmentDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolmentDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolmentDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

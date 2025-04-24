import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationModuleComponent } from './application-module.component';

describe('ApplicationModuleComponent', () => {
  let component: ApplicationModuleComponent;
  let fixture: ComponentFixture<ApplicationModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

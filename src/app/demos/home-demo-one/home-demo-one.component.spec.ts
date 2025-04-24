import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDemoOneComponent } from './home-demo-one.component';

describe('HomeDemoOneComponent', () => {
  let component: HomeDemoOneComponent;
  let fixture: ComponentFixture<HomeDemoOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDemoOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDemoOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

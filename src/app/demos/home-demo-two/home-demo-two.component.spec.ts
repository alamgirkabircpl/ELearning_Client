import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDemoTwoComponent } from './home-demo-two.component';

describe('HomeDemoTwoComponent', () => {
  let component: HomeDemoTwoComponent;
  let fixture: ComponentFixture<HomeDemoTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDemoTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDemoTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

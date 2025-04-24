import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDemoThreeComponent } from './home-demo-three.component';

describe('HomeDemoThreeComponent', () => {
  let component: HomeDemoThreeComponent;
  let fixture: ComponentFixture<HomeDemoThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDemoThreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDemoThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

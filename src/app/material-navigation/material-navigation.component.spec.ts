import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialNavigationComponent } from './material-navigation.component';

describe('MaterialNavigationComponent', () => {
  let component: MaterialNavigationComponent;
  let fixture: ComponentFixture<MaterialNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

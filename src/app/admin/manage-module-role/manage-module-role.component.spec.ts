import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageModuleRoleComponent } from './manage-module-role.component';

describe('ManageModuleRoleComponent', () => {
  let component: ManageModuleRoleComponent;
  let fixture: ComponentFixture<ManageModuleRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageModuleRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageModuleRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

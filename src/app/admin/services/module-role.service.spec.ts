import { TestBed } from '@angular/core/testing';

import { ModuleRoleService } from './module-role.service';

describe('ModuleRoleService', () => {
  let service: ModuleRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

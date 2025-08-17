import { TestBed } from '@angular/core/testing';

import { StudyPlanStorageService } from './study-plan-storage.service';

describe('StudyPlanStorageService', () => {
  let service: StudyPlanStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyPlanStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

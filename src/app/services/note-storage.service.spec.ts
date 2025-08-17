import { TestBed } from '@angular/core/testing';

import { NoteStorageService } from './note-storage.service';

describe('NoteStorageService', () => {
  let service: NoteStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

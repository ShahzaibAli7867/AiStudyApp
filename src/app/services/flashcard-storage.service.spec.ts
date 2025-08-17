import { TestBed } from '@angular/core/testing';

import { FlashcardStorageService } from './flashcard-storage.service';

describe('FlashcardStorageService', () => {
  let service: FlashcardStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashcardStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

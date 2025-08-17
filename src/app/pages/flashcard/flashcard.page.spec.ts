import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlashcardPage } from './flashcard.page';

describe('FlashcardPage', () => {
  let component: FlashcardPage;
  let fixture: ComponentFixture<FlashcardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashcardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

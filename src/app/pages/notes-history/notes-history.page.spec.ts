import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesHistoryPage } from './notes-history.page';

describe('NotesHistoryPage', () => {
  let component: NotesHistoryPage;
  let fixture: ComponentFixture<NotesHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

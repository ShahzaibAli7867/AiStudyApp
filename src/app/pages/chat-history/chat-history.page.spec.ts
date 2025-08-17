import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatHistoryPage } from './chat-history.page';

describe('ChatHistoryPage', () => {
  let component: ChatHistoryPage;
  let fixture: ComponentFixture<ChatHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

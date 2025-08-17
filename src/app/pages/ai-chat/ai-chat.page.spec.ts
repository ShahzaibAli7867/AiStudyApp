import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiChatPage } from './ai-chat.page';

describe('AiChatPage', () => {
  let component: AiChatPage;
  let fixture: ComponentFixture<AiChatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AiChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

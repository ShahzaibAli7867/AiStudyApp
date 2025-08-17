import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyPlansOverviewPage } from './study-plans-overview.page';

describe('StudyPlansOverviewPage', () => {
  let component: StudyPlansOverviewPage;
  let fixture: ComponentFixture<StudyPlansOverviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyPlansOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

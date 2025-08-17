import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyPlanPage } from './study-plan.page';

describe('StudyPlanPage', () => {
  let component: StudyPlanPage;
  let fixture: ComponentFixture<StudyPlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

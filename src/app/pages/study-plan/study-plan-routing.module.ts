import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudyPlanPage } from './study-plan.page';

const routes: Routes = [
  {
    path: '',
    component: StudyPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudyPlanPageRoutingModule {}

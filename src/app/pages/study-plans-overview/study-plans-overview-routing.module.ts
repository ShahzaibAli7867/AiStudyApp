import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudyPlansOverviewPage } from './study-plans-overview.page';

const routes: Routes = [
  {
    path: '',
    component: StudyPlansOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudyPlansOverviewPageRoutingModule {}

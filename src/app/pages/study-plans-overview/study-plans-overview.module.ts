import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudyPlansOverviewPageRoutingModule } from './study-plans-overview-routing.module';

import { StudyPlansOverviewPage } from './study-plans-overview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudyPlansOverviewPageRoutingModule
  ],
  declarations: [StudyPlansOverviewPage]
})
export class StudyPlansOverviewPageModule {}

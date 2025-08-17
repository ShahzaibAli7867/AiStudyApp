import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudyPlanPageRoutingModule } from './study-plan-routing.module';

import { StudyPlanPage } from './study-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudyPlanPageRoutingModule
  ],
  declarations: [StudyPlanPage]
})
export class StudyPlanPageModule {}

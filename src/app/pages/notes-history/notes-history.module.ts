import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesHistoryPageRoutingModule } from './notes-history-routing.module';

import { NotesHistoryPage } from './notes-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesHistoryPageRoutingModule
  ],
  declarations: [NotesHistoryPage]
})
export class NotesHistoryPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlashcardPageRoutingModule } from './flashcard-routing.module';

import { FlashcardPage } from './flashcard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlashcardPageRoutingModule
  ],
  declarations: [FlashcardPage]
})
export class FlashcardPageModule {}

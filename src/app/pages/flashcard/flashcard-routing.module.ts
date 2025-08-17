import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlashcardPage } from './flashcard.page';

const routes: Routes = [
  {
    path: '',
    component: FlashcardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlashcardPageRoutingModule {}

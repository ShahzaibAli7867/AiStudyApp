import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatHistoryPage } from './chat-history.page';

const routes: Routes = [
  {
    path: '',
    component: ChatHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatHistoryPageRoutingModule {}

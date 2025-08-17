import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatHistoryPageRoutingModule } from './chat-history-routing.module';

import { ChatHistoryPage } from './chat-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatHistoryPageRoutingModule
  ],
  declarations: [ChatHistoryPage]
})
export class ChatHistoryPageModule {}

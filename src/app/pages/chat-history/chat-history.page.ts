import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ChatConversation, ChatStorageService } from 'src/app/services/chat-storage.service';
//import { ChatStorageService, ChatConversation } from '../services/chat-storage.service';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.page.html',
  styleUrls: ['./chat-history.page.scss'],
  standalone: false,
})
export class ChatHistoryPage implements OnInit {
  chatConversations: ChatConversation[] = [];

  constructor(
    private chatStorage: ChatStorageService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    // Load chats when the component initializes
    await this.loadChats();
  }

  ionViewWillEnter() {
    // Also load chats every time the view is about to enter
    // This ensures updates from other pages (like ai-chat) are reflected.
    this.loadChats();
  }

  async loadChats() {
    this.chatConversations = await this.chatStorage.getAllChats();
  }

  openChat(chatId: string) {
    this.navCtrl.navigateForward(`/ai-chat/${chatId}`);
  }

  createNewChat() {
    this.navCtrl.navigateForward('/ai-chat'); // Navigate to the AI Chat page without an ID
  }

  async togglePin(chatId: string, event: Event) {
    event.stopPropagation(); // Prevent item click from firing
    await this.chatStorage.togglePinChat(chatId);
    await this.loadChats(); // Reload to reflect pin status and sorting
  }

  async editChatTitle(chat: ChatConversation) {
    const alert = await this.alertController.create({
      header: 'Edit Chat Title',
      inputs: [
        {
          name: 'newTitle',
          type: 'text',
          value: chat.title,
          placeholder: 'Enter new title',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: async (data) => {
            if (data.newTitle && data.newTitle.trim() !== '') {
              chat.title = data.newTitle.trim();
              await this.chatStorage.updateChat(chat);
              await this.loadChats(); // Reload to reflect the updated title
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteChat(chatId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this conversation?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.chatStorage.deleteChat(chatId);
            await this.loadChats(); // Reload to remove the deleted chat
          },
        },
      ],
    });
    await alert.present();
  }
}
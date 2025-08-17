import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Message } from '../pages/ai-chat/ai-chat.page';
//import { Message } from '../ai-chat/ai-chat.page'; // Import Message interface

export interface ChatConversation {
  id: string; 
  title: string; 
  messages: Message[]; 
  createdAt: number; 
  lastUpdated: number; 
  pinned: boolean; 
}

@Injectable({
  providedIn: 'root',
})
export class ChatStorageService {
  private _storage: Storage | null = null;
  private readonly CHATS_KEY = 'chat_conversations'; 

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // --- CRUD Operations for Chat Conversations ---


  async saveChat(chat: ChatConversation): Promise<void> {
    const allChats = (await this.getAllChats()) || [];
    allChats.push(chat);
    await this._storage?.set(this.CHATS_KEY, allChats);
  }

  async updateChat(updatedChat: ChatConversation): Promise<void> {
    let allChats = (await this.getAllChats()) || [];
    const index = allChats.findIndex((chat) => chat.id === updatedChat.id);
    if (index > -1) {
      allChats[index] = { ...updatedChat, lastUpdated: Date.now() }; // Update timestamp
      await this._storage?.set(this.CHATS_KEY, allChats);
    } else {
      console.warn('Chat not found for update:', updatedChat.id);
    }
  }

  
  async getChatById(id: string): Promise<ChatConversation | undefined> {
    const allChats = (await this.getAllChats()) || [];
    return allChats.find((chat) => chat.id === id);
  }
  async getAllChats(): Promise<ChatConversation[]> {
    const chats: ChatConversation[] = (await this._storage?.get(this.CHATS_KEY)) || [];
    // Sort: pinned first, then by last updated (newest first)
    return chats.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.lastUpdated - a.lastUpdated; // Newest first
    });
  }

  async deleteChat(id: string): Promise<void> {
    let allChats = (await this.getAllChats()) || [];
    allChats = allChats.filter((chat) => chat.id !== id);
    await this._storage?.set(this.CHATS_KEY, allChats);
  }

  async togglePinChat(id: string): Promise<void> {
    const allChats = (await this.getAllChats()) || [];
    const chatToToggle = allChats.find((chat) => chat.id === id);
    if (chatToToggle) {
      chatToToggle.pinned = !chatToToggle.pinned;
      await this.updateChat(chatToToggle);
    }
  }
}
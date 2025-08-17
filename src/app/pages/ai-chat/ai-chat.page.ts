import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController, AlertController, ActionSheetController } from '@ionic/angular'; // Add AlertController, ActionSheetController
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
//import { ChatStorageService, ChatConversation } from '../services/chat-storage.service'; // Import service and interface
import { ActivatedRoute } from '@angular/router'; // To get chat ID from URL
import { ChatConversation, ChatStorageService } from 'src/app/services/chat-storage.service';

import { Plugin } from '@capacitor/core';
import { GenericResponse, RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { FilePicker, PickedFile, PickFilesResult } from '@capawesome/capacitor-file-picker';

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: number; 
}

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.page.html',
  styleUrls: ['./ai-chat.page.scss'],
  standalone: false,
  providers: [ChatStorageService]
})
export class AiChatPage implements OnInit {
audioPath: any;
   isRecording = false;
  recordedAudio: string | null = null;
  selectedFileName: string | undefined;


async attachFile() {
    try {
      const result: PickFilesResult = await FilePicker.pickFiles({
        types: ['application/pdf', 'image/jpeg', 'image/png'],
    
        readData: false,
      });

      if (result.files.length > 0) {
        const file: PickedFile = result.files[0];
       
        this.ngZone.run(() => {
          this.selectedFileName = file.name;
        });
        console.log('Selected file:', file);
       
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  }
// async recordVoice() {
//     const permission = await VoiceRecorder.requestAudioRecordingPermission();
//     if (!permission.granted) {
//       alert('Permission denied');
//       return;
//     }

//     const started = await VoiceRecorder.startRecording();
//     if (started.value) {
//       this.isRecording = true;
//       console.log('Recording...');
//     }

//     // Optional wait for 5s
//     await new Promise((res) => setTimeout(res, 5000));

//     const result = await VoiceRecorder.stopRecording();
//     this.audioPath = result.value;
//     this.isRecording = false;

//     console.log('Recording saved:', this.audioPath);
//   }

startRecording() {
    this.isRecording = true;
    VoiceRecorder.startRecording()
      .then((result: GenericResponse) => {
        if (result.value) {
          console.log('Recording started');
        }
      })
      .catch(error => console.error(error));
  }

  stopRecording() {
    if (!this.isRecording) {
      return;
    }

    VoiceRecorder.stopRecording()
      .then((result: RecordingData) => {
        // Use ngZone.run to ensure view updates
        this.ngZone.run(() => {
          if (result.value && result.value.recordDataBase64) {
            const base64Sound = result.value.recordDataBase64;
            this.recordedAudio = `data:${result.value.mimeType};base64,${base64Sound}`;
            console.log('Recording stopped');
          }
          this.isRecording = false;
        });
      })
      .catch(error => console.error(error));
  }

  

  @ViewChild('chatContent', { static: false }) chatContent!: IonContent;

  currentChat: ChatConversation | undefined; 
  messages: Message[] = []; 
  userMessage: string = '';
  isTyping: boolean = false;
  chatId: string | null = null; 

  userAvatar: string = 'assets/ai-icon.png'; 
  aiAvatar: string = 'assets/ai-icon.png'; 

  private readonly AI_API_URL: string = 'https://api.openai.com/v1/chat/completions';
  private readonly API_KEY: string = 'YOUR_OPENAI_API_KEY'; 

  constructor(
    private http: HttpClient,
    private chatStorage: ChatStorageService, 
    private route: ActivatedRoute, 
    private navCtrl: NavController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private ngZone: NgZone 
  ) {

    VoiceRecorder.requestAudioRecordingPermission();
  }

  async ngOnInit() {
    // Check for a chat ID in the route parameters
    this.chatId = this.route.snapshot.paramMap.get('id');

    if (this.chatId) {
      // Load existing chat
      const loadedChat = await this.chatStorage.getChatById(this.chatId);
      if (loadedChat) {
        this.currentChat = loadedChat;
        this.messages = loadedChat.messages;
      } else {
        console.warn('Chat not found for ID:', this.chatId);
        // Optionally, redirect or start a new chat if ID is invalid
        this.startNewChat();
      }
    } else {
      // Start a new chat
      this.startNewChat();
    }
  }

  ionViewDidEnter() {
    this.scrollToBottom();
  }

  private startNewChat() {
    this.chatId = uuidv4(); // Generate a new ID for a new chat
    this.currentChat = {
      id: this.chatId,
      title: 'New Chat ' + new Date().toLocaleString(), // Placeholder title
      messages: [],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      pinned: false,
    };
    this.messages = this.currentChat.messages; // Ensure messages array refers to the chat's messages
    this.addMessage('ai', 'How can I help you today?');
    this.chatStorage.saveChat(this.currentChat); // Save the initial empty chat
  }

  addMessage(sender: 'user' | 'ai', text: string) {
    const newMessage: Message = { sender, text, timestamp: Date.now() };
    this.messages.push(newMessage);
    if (this.currentChat) {
      this.currentChat.messages = this.messages; // Keep chat object's messages updated
      this.currentChat.lastUpdated = Date.now(); // Update last updated timestamp
      this.chatStorage.updateChat(this.currentChat); // Persist update
    }
    this.scrollToBottom();
  }

  async sendMessage() {
    if (!this.userMessage.trim()) {
      return;
    }

    const messageToSend = this.userMessage.trim();
    this.addMessage('user', messageToSend); 
    this.userMessage = ''; 

    this.isTyping = true; 
    await this.fetchAiResponse(messageToSend); 
    this.isTyping = false;
    this.scrollToBottom(); 
  }

  async fetchAiResponse(userQuery: string) {
    // SIMULATED API RESPONSE for demonstration:
    const simulatedResponses: { [key: string]: string } = {
      'explain the concept of supply and demand in economics.':
        'Supply and demand is a fundamental concept in economics that describes the relationship between the quantity of a good or service that producers are willing to offer for sale (supply) and the quantity that consumers are willing to buy (demand) at a given price. The interaction of supply and demand determines the market price and quantity of a good or service.',
      'what is blockchain':
        'Blockchain is a decentralized, distributed, and unchangeable ledger system. It records transactions in "blocks" which are then linked together using cryptography. This makes it highly secure and transparent.',
      'tell me a fact':
        'The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.',
      'hello': 'Hello there! How can I assist you today?',
      'hi': 'Hi! What\'s on your mind?',
    };

    let aiResponseText = 'I am sorry, I do not have information on that at the moment. Please try another question.';
    for (const key in simulatedResponses) {
      if (userQuery.toLowerCase().includes(key.toLowerCase())) {
        aiResponseText = simulatedResponses[key];
        break;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    this.addMessage('ai', aiResponseText);

    // --- Real API Integration (Uncomment and configure when ready) ---
    /*
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.API_KEY}`,
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userQuery }],
      max_tokens: 150,
      temperature: 0.7,
    };

    try {
      const response: any = await firstValueFrom(this.http.post(this.AI_API_URL, body, { headers }));
      const aiResponseText = response.choices[0].message.content;
      this.addMessage('ai', aiResponseText);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      this.addMessage('ai', 'Oops! Something went wrong with the AI. Please try again later.');
    } finally {
      this.isTyping = false;
    }
    */
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContent) {
        this.chatContent.scrollToBottom(300);
      }
    }, 50);
  }

  async presentChatActions(messageIndex: number) {
    const message = this.messages[messageIndex];
    if (!message) return;

    const actionSheet = await this.actionSheetController.create({
      header: 'Message Actions',
      buttons: [
        {
          text: 'Edit Message',
          icon: 'pencil-outline',
          handler: () => {
            this.editMessage(messageIndex);
          },
        },
        {
          text: 'Delete Message',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.deleteMessage(messageIndex);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async editMessage(index: number) {
    const messageToEdit = this.messages[index];
    if (!messageToEdit || messageToEdit.sender === 'ai') { 
      console.log('Cannot edit AI messages or invalid index.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Edit Message',
      inputs: [
        {
          name: 'editedText',
          type: 'textarea',
          value: messageToEdit.text,
          placeholder: 'Edit your message here',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (data) => {
            if (data.editedText && this.currentChat) {
              this.messages[index].text = data.editedText;
              this.messages[index].timestamp = Date.now(); 
              this.currentChat.messages = this.messages;
              this.currentChat.lastUpdated = Date.now();
              this.chatStorage.updateChat(this.currentChat);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteMessage(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this message?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            if (this.currentChat) {
              this.messages.splice(index, 1);
              this.currentChat.messages = this.messages;
              this.currentChat.lastUpdated = Date.now();
              this.chatStorage.updateChat(this.currentChat);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  adjustInputHeight() {

  }
}
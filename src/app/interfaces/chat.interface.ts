export interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface VoiceRecording {
  recordDataBase64: string;
  mimeType: string;
  msDuration: number;
}

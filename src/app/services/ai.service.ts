import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private flashcardData: string = '';

  getFlashcardData() {
    return this.flashcardData;
  }
  setFlashcardData(aiResponse: string) {
    this.flashcardData = aiResponse;
  }
  getKeyPoints(noteContent: string): string | PromiseLike<string> {
    return ''; // Placeholder for actual implementation 
  }
  getSummary(noteContent: string): string | PromiseLike<string> {
    return ''; // Placeholder for actual implementation
  }

  constructor() { }
}

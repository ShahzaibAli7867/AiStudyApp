import { Injectable } from '@angular/core';

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  keyPoints?: string[];
  flashcards?: Flashcard[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private currentNote: Note | null = null;

  constructor() { }

  setCurrentNote(note: Note) {
    this.currentNote = note;
  }

  getCurrentNote(): Note | null {
    return this.currentNote;
  }

  generateSummary(content: string): string {
    // Simulate AI summary generation
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return content;
    
    // Take first and last sentences as a simple summary
    const summary = sentences.slice(0, Math.min(2, sentences.length)).join('. ') + '.';
    return summary;
  }

  highlightKeyPoints(content: string): string[] {
    // Simulate AI key point extraction
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keyPoints = sentences
      .filter((sentence, index) => index % 2 === 0) // Take every other sentence
      .slice(0, 3) // Max 3 key points
      .map(point => point.trim() + '.');
    
    return keyPoints.length > 0 ? keyPoints : ['No key points found.'];
  }

  convertToFlashcards(content: string, summary: string): Flashcard[] {
    // Simulate AI flashcard generation from content and summary
    const flashcards: Flashcard[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Generate flashcards from content
    sentences.slice(0, 3).forEach((sentence, index) => {
      const words = sentence.trim().split(' ');
      if (words.length > 5) {
        const question = `What is mentioned about ${words[2]}?`;
        const answer = sentence.trim() + '.';
        
        flashcards.push({
          id: `fc_${index}`,
          question: question,
          answer: answer,
          category: 'General'
        });
      }
    });

    // Add summary-based flashcard
    if (summary && summary.length > 10) {
      flashcards.push({
        id: 'fc_summary',
        question: 'What is the main summary of this note?',
        answer: summary,
        category: 'Summary'
      });
    }

    return flashcards.length > 0 ? flashcards : [{
      id: 'fc_default',
      question: 'What is the main topic of this note?',
      answer: 'The note contains important information that can be reviewed.',
      category: 'General'
    }];
  }
}
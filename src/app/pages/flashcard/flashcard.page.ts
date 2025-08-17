import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService ,Note} from 'src/app/services/notes.service';
import { Flashcard } from 'src/app/services/notes.service';
//import { NoteService, Note, Flashcard } from '../../services/note.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.page.html',
  styleUrls: ['./flashcard.page.scss'],
  standalone:false,
})
export class FlashcardPage implements OnInit {
  note: Note | null = null;
  flashcards: Flashcard[] = [];
  currentCardIndex: number = 0;
  showAnswer: boolean = false;
  userProgress: { [key: string]: 'know' | 'dont-know' | null } = {};

  constructor(
    private router: Router,
    private noteService: NoteService
  ) {}

  ngOnInit() {
    this.note = this.noteService.getCurrentNote();
    if (!this.note || !this.note.flashcards) {
      this.router.navigate(['/notes']);
      return;
    }
    this.flashcards = this.note.flashcards;
  }

  get currentCard(): Flashcard | null {
    return this.flashcards[this.currentCardIndex] || null;
  }

  get progressCount(): string {
    return `${this.currentCardIndex + 1}/${this.flashcards.length}`;
  }

  get progressPercentage(): number {
    return ((this.currentCardIndex + 1) / this.flashcards.length) * 100;
  }

  nextCard() {
    if (this.currentCardIndex < this.flashcards.length - 1) {
      this.currentCardIndex++;
      this.showAnswer = false;
    }
  }

  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.showAnswer = false;
    }
  }

  toggleAnswer() {
    this.showAnswer = !this.showAnswer;
  }

  markAsKnow() {
    if (this.currentCard) {
      this.userProgress[this.currentCard.id] = 'know';
      this.nextCard();
    }
  }

  markAsDontKnow() {
    if (this.currentCard) {
      this.userProgress[this.currentCard.id] = 'dont-know';
      this.nextCard();
    }
  }

  reviewLater() {
    this.nextCard();
  }

  goBack() {
    this.router.navigate(['/notes']);
  }
}

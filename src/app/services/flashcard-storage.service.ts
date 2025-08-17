import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

// Interface for a single flashcard
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
  lastReviewed: number;
  interval: number;
  easeFactor: number;
  nextReviewDate?: number;
}

// Interface for a flashcard deck
export interface FlashcardDeck {
  id: string;
  title: string;
  description?: string;
  flashcards: Flashcard[];
  createdAt: number;
  lastUpdated: number;
  pinned: boolean; // Option to pin favorite decks
}

@Injectable({
  providedIn: 'root',
})
export class FlashcardStorageService {
  private _storage: Storage | null = null;
  private readonly DECKS_KEY = 'flashcard_decks'; 
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // --- CRUD Operations for Flashcard Decks ---

  /**
   * Saves a new flashcard deck.
   */
  async saveDeck(deck: FlashcardDeck): Promise<void> {
    let allDecks = (await this.getAllDecks()) || [];
    allDecks.push(deck);
    await this._storage?.set(this.DECKS_KEY, allDecks);
  }

  
  async updateDeck(updatedDeck: FlashcardDeck): Promise<void> {
    let allDecks = (await this.getAllDecks()) || [];
    const index = allDecks.findIndex((deck) => deck.id === updatedDeck.id);
    if (index > -1) {
      allDecks[index] = { ...updatedDeck, lastUpdated: Date.now() }; // Update timestamp
      await this._storage?.set(this.DECKS_KEY, allDecks);
    } else {
      console.warn('Flashcard Deck not found for update:', updatedDeck.id);
    }
  }

  
  async getDeckById(id: string): Promise<FlashcardDeck | undefined> {
    const allDecks = (await this.getAllDecks()) || [];
    return allDecks.find((deck) => deck.id === id);
  }

  
  async getAllDecks(): Promise<FlashcardDeck[]> {
    const decks: FlashcardDeck[] = (await this._storage?.get(this.DECKS_KEY)) || [];
    return decks.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.lastUpdated - a.lastUpdated; // Newest first
    });
  }

 
  async deleteDeck(id: string): Promise<void> {
    let allDecks = (await this.getAllDecks()) || [];
    allDecks = allDecks.filter((deck) => deck.id !== id);
    await this._storage?.set(this.DECKS_KEY, allDecks);
  }

  async togglePinDeck(id: string): Promise<void> {
    const allDecks = (await this.getAllDecks()) || [];
    const deckToToggle = allDecks.find((deck) => deck.id === id);
    if (deckToToggle) {
      deckToToggle.pinned = !deckToToggle.pinned;
      await this.updateDeck(deckToToggle);
    }
  }

}
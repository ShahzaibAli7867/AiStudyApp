import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Note {
  id: string; // Unique ID for the note
  title: string; // Title of the note
  content: string; // Main content of the note
  createdAt: number; // Timestamp of creation
  lastUpdated: number; // Timestamp of last update
  pinned: boolean; // Is this note pinned?
}

@Injectable({
  providedIn: 'root',
})
export class NoteStorageService {
  private _storage: Storage | null = null;
  private readonly NOTES_KEY = 'studybuddy_notes'; // Key for storing all notes

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // --- CRUD Operations for Notes ---

  /**
   * Saves a new note.
   */
  async saveNote(note: Note): Promise<void> {
    const allNotes = (await this.getAllNotes()) || [];
    allNotes.push(note);
    await this._storage?.set(this.NOTES_KEY, allNotes);
  }

  /**
   * Updates an existing note.
   */
  async updateNote(updatedNote: Note): Promise<void> {
    let allNotes = (await this.getAllNotes()) || [];
    const index = allNotes.findIndex((note) => note.id === updatedNote.id);
    if (index > -1) {
      allNotes[index] = { ...updatedNote, lastUpdated: Date.now() }; // Update timestamp
      await this._storage?.set(this.NOTES_KEY, allNotes);
    } else {
      console.warn('Note not found for update:', updatedNote.id);
    }
  }

  /**
   * Retrieves a single note by ID.
   */
  async getNoteById(id: string): Promise<Note | undefined> {
    const allNotes = (await this.getAllNotes()) || [];
    return allNotes.find((note) => note.id === id);
  }

  /**
   * Retrieves all notes.
   * Returns notes sorted by lastUpdated (descending), with pinned notes first.
   */
  async getAllNotes(): Promise<Note[]> {
    const notes: Note[] = (await this._storage?.get(this.NOTES_KEY)) || [];
    // Sort: pinned first, then by last updated (newest first)
    return notes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.lastUpdated - a.lastUpdated; // Newest first
    });
  }

  /**
   * Deletes a note by ID.
   */
  async deleteNote(id: string): Promise<void> {
    let allNotes = (await this.getAllNotes()) || [];
    allNotes = allNotes.filter((note) => note.id !== id);
    await this._storage?.set(this.NOTES_KEY, allNotes);
  }

  /**
   * Toggles the pinned status of a note.
   */
  async togglePinNote(id: string): Promise<void> {
    const allNotes = (await this.getAllNotes()) || [];
    const noteToToggle = allNotes.find((note) => note.id === id);
    if (noteToToggle) {
      noteToToggle.pinned = !noteToToggle.pinned;
      await this.updateNote(noteToToggle);
    }
  }
}
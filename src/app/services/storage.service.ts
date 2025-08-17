import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

// Define the interface for a Note (matching what's in notes.page.ts)
export interface Note {
  id: string; // Unique ID for the note
  title: string;
  content: string;
  createdAt: number; // Timestamp
  lastModified: number; // Timestamp
  pinned: boolean; // Option to pin notes
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private readonly NOTES_KEY = 'my_notes'; // Key for storing all notes

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // Create the storage instance.
    // This is important for ensuring the storage is ready before use.
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /**
   * Saves a note (either creates a new one or updates an existing one).
   */
  async saveNote(note: Note): Promise<void> {
    let allNotes = (await this.getAllNotes()) || [];

    // Check if the note already exists (for updating)
    const existingNoteIndex = allNotes.findIndex((n) => n.id === note.id);

    if (existingNoteIndex > -1) {
      // Update existing note
      allNotes[existingNoteIndex] = { ...note, lastModified: Date.now() }; // Ensure lastModified is updated
    } else {
      // Add new note
      allNotes.push({ ...note, createdAt: Date.now(), lastModified: Date.now() }); // Set timestamps for new note
    }

    await this._storage?.set(this.NOTES_KEY, allNotes);
  }

  /**
   * Retrieves a single note by its ID.
   */
  async getNote(id: string): Promise<Note | undefined> {
    const allNotes = (await this.getAllNotes()) || [];
    return allNotes.find((note) => note.id === id);
  }

  /**
   * Retrieves all notes.
   * Optionally sorts notes by lastModified date, with pinned notes first.
   */
  async getAllNotes(): Promise<Note[]> {
    const notes: Note[] = (await this._storage?.get(this.NOTES_KEY)) || [];
    // Sort notes: pinned ones first, then by last modified (newest first)
    return notes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.lastModified - a.lastModified;
    });
  }

  /**
   * Deletes a note by its ID.
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
      await this.saveNote(noteToToggle); // Use saveNote to trigger update and lastModified
    }
  }
}
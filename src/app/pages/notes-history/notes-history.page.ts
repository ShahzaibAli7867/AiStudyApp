import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Note, NoteStorageService } from 'src/app/services/note-storage.service';
//import { NoteStorageService, Note } from '../services/note-storage.service';

@Component({
  selector: 'app-notes-history',
  templateUrl: './notes-history.page.html',
  styleUrls: ['./notes-history.page.scss'],
  standalone: false,
})
export class NotesHistoryPage implements OnInit {
  notes: Note[] = [];

  constructor(
    private noteStorage: NoteStorageService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.loadNotes();
  }

  ionViewWillEnter() {
    // Reload notes every time the view is about to enter
    this.loadNotes();
  }

  async loadNotes() {
    this.notes = await this.noteStorage.getAllNotes();
  }

  openNote(noteId: string) {
    this.navCtrl.navigateForward(`/notes/${noteId}`);
  }

  createNewNote() {
    this.navCtrl.navigateForward('/notes'); // Navigate to the Notes page without an ID
  }

  async togglePin(noteId: string, event: Event) {
    event.stopPropagation(); // Prevent item click from firing
    await this.noteStorage.togglePinNote(noteId);
    await this.loadNotes(); // Reload to reflect pin status and sorting
  }

  async editNoteTitle(note: Note) {
    const alert = await this.alertController.create({
      header: 'Edit Note Title',
      inputs: [
        {
          name: 'newTitle',
          type: 'text',
          value: note.title,
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
              note.title = data.newTitle.trim();
              await this.noteStorage.updateNote(note);
              await this.loadNotes(); // Reload to reflect the updated title
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteNote(noteId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this note?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.noteStorage.deleteNote(noteId);
            await this.loadNotes(); // Reload to remove the deleted note
          },
        },
      ],
    });
    await alert.present();
  }
}
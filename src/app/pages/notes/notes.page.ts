import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { NoteService ,Note} from 'src/app/services/notes.service';
//import { NoteService, Note } from '../../services/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false,
})
export class NotesPage {
  note: Note = {
    id: 'note_1',
    title: '',
    content: ''
  };

  constructor(
    private router: Router,
    private noteService: NoteService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async generateSummary() {
    if (!this.note.content.trim()) {
      this.showAlert('Error', 'Please enter some content to generate a summary.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Generating summary...',
      duration: 1500
    });
    await loading.present();

    setTimeout(() => {
      this.note.summary = this.noteService.generateSummary(this.note.content);
      loading.dismiss();
      this.showAlert('Success', 'Summary generated successfully!');
    }, 1500);
  }

  async highlightKeyPoints() {
    if (!this.note.content.trim()) {
      this.showAlert('Error', 'Please enter some content to highlight key points.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Highlighting key points...',
      duration: 1500
    });
    await loading.present();

    setTimeout(() => {
      this.note.keyPoints = this.noteService.highlightKeyPoints(this.note.content);
      loading.dismiss();
      this.showAlert('Success', 'Key points highlighted successfully!');
    }, 1500);
  }

  async convertToFlashcards() {
    if (!this.note.content.trim()) {
      this.showAlert('Error', 'Please enter some content to convert to flashcards.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Converting to flashcards...',
      duration: 2000
    });
    await loading.present();

    setTimeout(() => {
      this.note.flashcards = this.noteService.convertToFlashcards(
        this.note.content, 
        this.note.summary || ''
      );
      this.noteService.setCurrentNote(this.note);
      loading.dismiss();
      this.router.navigate(['/flashcard']);
    }, 2000);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

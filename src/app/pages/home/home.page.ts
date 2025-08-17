import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() { 
   
  }

  // --- Quick Action Functions ---
  askAI() {
   this.router.navigate(['/ai-chat']);
    
  }

  smartNotes() {
    this.router.navigate(['/notes']);
  }

  flashcards() {
    this.router.navigate(['/flashcard']);
  }

  studyPlan() {
    this.router.navigate(['/planner']);
   
  }

  progressTracker() {
    this.router.navigate(['/progress']);
  }

  openSettings() {
      this.router.navigate(['/setting']);
  }
}
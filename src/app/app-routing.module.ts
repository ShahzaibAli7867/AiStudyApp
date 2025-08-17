import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'ai-chat',
    loadChildren: () => import('./pages/ai-chat/ai-chat.module').then( m => m.AiChatPageModule)
  },
  {
    path: 'notes',
    loadChildren: () => import('./pages/notes/notes.module').then( m => m.NotesPageModule)
  },
  {
    path: 'flashcard',
    loadChildren: () => import('./pages/flashcard/flashcard.module').then( m => m.FlashcardPageModule)
  },
  
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'progress',
    loadChildren: () => import('./pages/progress/progress.module').then( m => m.ProgressPageModule)
  },
  {
    path: 'chat-history',
    loadChildren: () => import('./pages/chat-history/chat-history.module').then( m => m.ChatHistoryPageModule)
  },
  {
    path: 'notes-history',
    loadChildren: () => import('./pages/notes-history/notes-history.module').then( m => m.NotesHistoryPageModule)
  },
  // {
  //   path: 'flashcard-decks',
  //   loadChildren: () => import('./pages/flashcard-decks/flashcard-decks.module').then( m => m.FlashcardDecksPageModule)
  // },
  // {
  //   path: 'flashcard-deck-editor',
  //   loadChildren: () => import('./pages/flashcard-deck-editor/flashcard-deck-editor.module').then( m => m.FlashcardDeckEditorPageModule)
  // },
  {
    path: 'study-plan',
    loadChildren: () => import('./pages/study-plan/study-plan.module').then( m => m.StudyPlanPageModule)
  },
  {
    path: 'study-plans-overview',
    loadChildren: () => import('./pages/study-plans-overview/study-plans-overview.module').then( m => m.StudyPlansOverviewPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { NewsFeed } from './components/news-feed/news-feed';

export const routes: Routes = [
  { path: '', component: NewsFeed },
  { path: '**', redirectTo: '' }
];

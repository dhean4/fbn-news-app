import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../interfaces/article';

@Component({
  selector: 'app-news-card',
  imports: [CommonModule],
  templateUrl: './news-card.html',
  styleUrl: './news-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsCard {
  @Input({ required: true }) article!: Article;

  readonly isBookmarked = signal(false);
  readonly imageErrored = signal(false);

  get timeAgo(): string {
    const published = new Date(this.article.publishedAt);
    const diffMs = Date.now() - published.getTime();
    const mins = Math.floor(diffMs / 60_000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  /** Returns null if the author field is a URL rather than a real name. */
  get displayAuthor(): string | null {
    const a = this.article.author;
    if (!a) return null;
    try { new URL(a); return null; } catch { /* not a URL */ }
    const name = a.split(',')[0].trim();
    return name.length > 0 ? name : null;
  }

  onImageError(): void {
    this.imageErrored.set(true);
  }

  toggleBookmark(): void {
    this.isBookmarked.update(v => !v);
  }
}

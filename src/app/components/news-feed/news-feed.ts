import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../services/news';
import { Article } from '../../interfaces/article';
import { NewsCard } from '../news-card/news-card';

@Component({
  selector: 'app-news-feed',
  imports: [CommonModule, NewsCard],
  templateUrl: './news-feed.html',
  styleUrl: './news-feed.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsFeed implements OnInit {
  private readonly newsService = inject(NewsService);

  private readonly pageSize = 6;
  readonly currentPage = signal(1);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  /** Full filtered list fetched once; pagination is done client-side. */
  private readonly allArticles = signal<Article[]>([]);

  /** Slice of allArticles for the current page. */
  readonly articles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.allArticles().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.allArticles().length / this.pageSize))
  );

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const pages: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }
    return pages;
  });

  ngOnInit(): void {
    this.newsService.getTopHeadlines(1, 100).subscribe({
      next: (res) => {
        this.allArticles.set(res.articles);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load articles. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByUrl(_: number, article: Article): string {
    return article.url;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Book } from '../../../../types/types';
import { MergeRangePipe } from '../../pipes/merge-range.pipe';
import { BooksCardComponent } from '../books-card/books-card.component';
import { hlmMuted, hlmH4 } from '../ui-typography-helm/src';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';

@Component({
  selector: 'app-book-display',
  standalone: true,
  imports: [MergeRangePipe, BooksCardComponent, HlmSeparatorDirective],
  templateUrl: './book-display.component.html',
  styleUrl: './book-display.component.scss',
})
export class BookDisplayComponent implements OnInit {
  public readonly hlmMuted = hlmMuted;
  public readonly hlmH4 = hlmH4;

  @Input() books: Book[] = [];
  categorizedBooks: { range: string; books: Book[] }[] = [];

  ngOnInit() {
    this.categorizeBooks();
  }

  categorizeBooks() {
    if (!this.books || this.books.length === 0) {
      this.categorizedBooks = [];
      return;
    }

    // Sort books by publishedYear in descending order
    this.books.sort((a, b) => b.publishYear - a.publishYear);

    const currentYear = new Date().getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    const endYear =
      Math.floor(this.books[this.books.length - 1].publishYear / 10) * 10;

    let intervalStart = startYear;
    let intervalEnd = startYear - 9;
    let intervalBooks: Book[] = [];
    let emptyIntervals: string[] = [];

    for (let year = startYear; year >= endYear; year -= 10) {
      intervalBooks = this.books.filter(
        book =>
          book.publishYear <= intervalStart && book.publishYear >= intervalEnd
      );

      if (intervalBooks.length > 0) {
        if (emptyIntervals.length > 0) {
          this.categorizedBooks.push({
            range: emptyIntervals.join(' - '),
            books: [],
          });
          emptyIntervals = [];
        }
        this.categorizedBooks.push({
          range: `${intervalEnd}-${intervalStart}`,
          books: intervalBooks,
        });
      } else {
        emptyIntervals.push(`${intervalEnd}-${intervalStart}`);
      }

      intervalStart -= 10;
      intervalEnd -= 10;
    }

    if (emptyIntervals.length > 0) {
      this.categorizedBooks.push({
        range: emptyIntervals.join(' - '),
        books: [],
      });
    }
  }
}

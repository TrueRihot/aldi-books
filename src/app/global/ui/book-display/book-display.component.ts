import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Book } from '../../../../types/types';
import { BooksCardComponent } from '../books-card/books-card.component';
import { hlmMuted, hlmH4 } from '../ui-typography-helm/src';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';

/**
 * Component to display a list of books categorized by decade.
 */
@Component({
  selector: 'app-book-display',
  standalone: true,
  imports: [BooksCardComponent, HlmSeparatorDirective],
  templateUrl: './book-display.component.html',
  styleUrl: './book-display.component.scss',
})
export class BookDisplayComponent implements OnInit, OnChanges {
  /** CSS class for muted text */
  public readonly hlmMuted = hlmMuted;
  /** CSS class for H4 headers */
  public readonly hlmH4 = hlmH4;

  /**
   * Input property to receive an array of books
   * @type {Book[]}
   */
  @Input() books: Book[] = [];

  /**
   * Array to hold categorized books by decade
   * @type {{ range: string; books: Book[] }[]}
   */
  categorizedBooks: { range: string; books: Book[] }[] = [];

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Calls the categorizeBooks method to categorize the books.
   */
  ngOnInit() {
    this.categorizeBooks();
  }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * @param {SimpleChanges} changes - Object of changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['books']) {
      this.categorizeBooks();
    }
  }

  /**
   * Categorizes the books by decade and stores the result in categorizedBooks.
   * If there are no books, categorizedBooks is set to an empty array.
   */
  categorizeBooks() {
    if (!this.books || this.books.length === 0) {
      this.categorizedBooks = [];
      return;
    }

    this.categorizedBooks = [];

    // Sort books by publish year in descending order
    this.books.sort((a, b) => b.publishYear - a.publishYear);

    const currentYear = new Date().getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    const endYear =
      Math.floor(this.books[this.books.length - 1].publishYear / 10) * 10;

    let intervalStart = startYear;
    let intervalEnd = startYear - 9;
    let emptyIntervals: { start: number; end: number } | null = null;

    // Loop through each decade from startYear to endYear
    for (let year = startYear; year >= endYear; year -= 10) {
      const intervalBooks = this.books.filter(
        book =>
          book.publishYear <= intervalStart && book.publishYear >= intervalEnd
      );

      if (intervalBooks.length > 0) {
        if (emptyIntervals) {
          this.categorizedBooks.push({
            range: `${emptyIntervals.end}-${emptyIntervals.start}`,
            books: [],
          });
          emptyIntervals = null;
        }
        this.categorizedBooks.push({
          range: `${intervalEnd}-${intervalStart}`,
          books: intervalBooks,
        });
      } else {
        if (emptyIntervals) {
          emptyIntervals.end = intervalEnd;
        } else {
          emptyIntervals = { start: intervalStart, end: intervalEnd };
        }
      }

      intervalStart -= 10;
      intervalEnd -= 10;
    }

    // Add any remaining empty intervals
    if (emptyIntervals) {
      this.categorizedBooks.push({
        range: `${emptyIntervals.end}-${emptyIntervals.start}`,
        books: [],
      });
    }

    // Add the current decade
    const currentDecadeBooks = this.books.filter(
      book => book.publishYear > startYear && book.publishYear <= currentYear
    );
    if (currentDecadeBooks.length > 0) {
      this.categorizedBooks.unshift({
        range: `${startYear + 1}-${currentYear}`,
        books: currentDecadeBooks,
      });
    }
  }
}

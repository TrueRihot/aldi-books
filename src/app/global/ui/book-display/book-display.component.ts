import { Component, Input, OnInit } from '@angular/core';
import { Book } from '../../../../types/types';
import { MergeRangePipe } from '../../pipes/merge-range.pipe';
import { BooksCardComponent } from '../books-card/books-card.component';
import { hlmMuted, hlmH4 } from '../ui-typography-helm/src';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';

/**
 * Component to display a list of books categorized by decade.
 */
@Component({
  selector: 'app-book-display',
  standalone: true,
  imports: [MergeRangePipe, BooksCardComponent, HlmSeparatorDirective],
  templateUrl: './book-display.component.html',
  styleUrl: './book-display.component.scss',
})
export class BookDisplayComponent implements OnInit {
  /** CSS class for muted text */
  public readonly hlmMuted = hlmMuted;
  /** CSS class for H4 headers */
  public readonly hlmH4 = hlmH4;

  /** Input property to receive an array of books */
  @Input() books: Book[] = [];
  /** Array to hold categorized books by decade */
  categorizedBooks: { range: string; books: Book[] }[] = [];

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Calls the categorizeBooks method to categorize the books.
   */
  ngOnInit() {
    this.categorizeBooks();
  }

  /**
   * Categorizes the books by decade and stores the result in categorizedBooks.
   * If there are no books, categorizedBooks is set to an empty array.
   */

  categorizeBooks() {
    // Check if the books array is empty or undefined
    if (!this.books || this.books.length === 0) {
      this.categorizedBooks = [];
      return;
    }

    // Sort books by publishYear in descending order
    this.books.sort((a, b) => b.publishYear - a.publishYear);

    // Get the current year and calculate the start year of the current decade
    const currentYear = new Date().getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    // Calculate the end year of the earliest decade in the books array
    const endYear =
      Math.floor(this.books[this.books.length - 1].publishYear / 10) * 10;

    // Initialize interval start and end years for categorization
    let intervalStart = startYear;
    let intervalEnd = startYear - 9;
    let intervalBooks: Book[] = [];
    let emptyIntervals: string[] = [];

    // Loop through each decade from the current decade to the earliest decade
    for (let year = startYear; year >= endYear; year -= 10) {
      // Filter books that fall within the current decade interval
      intervalBooks = this.books.filter(
        book =>
          book.publishYear <= intervalStart && book.publishYear >= intervalEnd
      );

      // If there are books in the current interval, add them to categorizedBooks
      if (intervalBooks.length > 0) {
        // If there are empty intervals, add them as empty categories
        if (emptyIntervals.length > 0) {
          this.categorizedBooks.push({
            range: emptyIntervals.join(' - '),
            books: [],
          });
          emptyIntervals = [];
        }
        // Add the current interval and its books to categorizedBooks
        this.categorizedBooks.push({
          range: `${intervalEnd}-${intervalStart}`,
          books: intervalBooks,
        });
      } else {
        // If no books are found in the current interval, add it to emptyIntervals
        emptyIntervals.push(`${intervalEnd}-${intervalStart}`);
      }

      // Move to the next decade interval
      intervalStart -= 10;
      intervalEnd -= 10;
    }

    // If there are any remaining empty intervals, add them as empty categories
    if (emptyIntervals.length > 0) {
      this.categorizedBooks.push({
        range: emptyIntervals.join(' - '),
        books: [],
      });
    }
  }
}

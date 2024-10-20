import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Book } from '../../../types/types';
import { environment } from '../../../environments/environment';

/**
 * DataService is responsible for fetching and caching book data from the API.
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiPath;
  public cache$ = new BehaviorSubject<Book[] | null>(null);
  private lastFetchTime: number | null = null;
  private cacheDuration = 60000; // Cache duration in milliseconds (e.g., 1 minute)

  constructor(private http: HttpClient) {}

  /**
   * Fetches books from the cache if available and not expired, otherwise fetches from the API.
   * @returns {Observable<Book[] | null>} An observable containing the list of books or null.
   */
  public getBooks(): Observable<Book[] | null> {
    const now = Date.now();
    if (
      this.cache$.value &&
      this.lastFetchTime &&
      now - this.lastFetchTime < this.cacheDuration
    ) {
      return this.logReturnMiddleware(this.cache$.asObservable());
    } else {
      return this.logReturnMiddleware(this.getLatestBooks());
    }
  }

  /**
   * Fetches the latest books from the API and updates the cache.
   * @returns {Observable<Book[]>} An observable containing the list of books.
   */
  public getLatestBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`).pipe(
      tap(books => {
        this.cache$.next(books);
        this.lastFetchTime = Date.now();
      })
    );
  }

  /**
   * Logs information about the observable being returned.
   * @param {Observable<Book[] | null>} obs - The observable to log information about.
   * @returns {Observable<Book[] | null>} The same observable passed as parameter.
   */
  private logReturnMiddleware(obs: Observable<Book[] | null>) {
    console.log('Data service returning observable');
    console.log('------------------------');
    console.log('Last fetch time: ', this.lastFetchTime);
    console.log('Cache duration: ', this.cacheDuration);
    console.log('Current time: ', Date.now());
    console.log(
      'Time since last fetch: ',
      Date.now() - (this.lastFetchTime ?? 0)
    );
    if (!environment.production) {
      obs.subscribe(res => {
        console.log('Data service response: ');
        console.log(res);
        console.log('------------------------');
      });
    }
    return obs;
  }

  /**
   * Posts a new book to the API.
   * @param {Book} book - The book to be posted.
   * @returns {Observable<Book>} An observable containing the posted book.
   */
  private postBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/books`, book);
  }

  /**
   * Inserts a new book into the cache and posts it to the API.
   * @param {Book} book - The book to be inserted.
   * @returns {Observable<Book>} An observable containing the inserted book.
   */
  public insertBook(book: Book): Observable<Book> {
    return this.postBook(book).pipe(
      tap(() => {
        const books = this.cache$.value;
        if (!books) return;
        this.cache$.next([book, ...books]);
      })
    );
  }
}

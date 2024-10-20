import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Book } from '../../../types/types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiPath;
  public cache$ = new BehaviorSubject<Book[] | null>(null);
  private lastFetchTime: number | null = null;
  private cacheDuration = 60000; // Cache duration in milliseconds (e.g., 1 minute)

  constructor(private http: HttpClient) {}

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

  public getLatestBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`).pipe(
      tap(books => {
        this.cache$.next(books);
        this.lastFetchTime = Date.now();
      })
    );
  }

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

  private postBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/books`, book);
  }

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

import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../../global/ui/page/page.component';
import { DataService } from '../../global/services/data.service';
import { Book } from '../../../types/types';
import { HlmCardDirective } from '../../global/ui/ui-card-helm/src';
import { BookDisplayComponent } from '../../global/ui/book-display/book-display.component';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { AddBookComponent } from '../../global/ui/add-book/add-book.component';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [
    PageComponent,
    HlmCardDirective,
    BookDisplayComponent,
    HlmSpinnerComponent,
    AddBookComponent,
  ],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.scss',
})
export class BooksPageComponent implements OnInit {
  public books: Book[] | null = [];
  public isFetching: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.isFetching = true;
    this.dataService.getBooks().subscribe();

    this.dataService.cache$.subscribe(res => {
      this.books = res;
      this.isFetching = false;
    });
  }
}

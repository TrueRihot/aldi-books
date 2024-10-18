import { Component } from '@angular/core';
import { PageComponent } from '../../global/ui/page/page.component';
import { hlmH1 } from '../../global/ui/ui-typography-helm/src';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [PageComponent],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.scss',
})
export class BooksPageComponent {
  protected readonly hlmH1 = hlmH1;
}

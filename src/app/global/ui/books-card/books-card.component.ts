import { Component, Input } from '@angular/core';
import { Book } from '../../../../types/types';
import { HlmCardDirective } from '../ui-card-helm/src';
import { hlmH3, hlmSmall, hlmMuted } from '../ui-typography-helm/src';
import { HlmIconComponent } from '../ui-icon-helm/src';
import { NgTemplateOutlet } from '@angular/common';
import { AverageRatingPipe } from '../../pipes/average-rating.pipe';
import { provideIcons } from '@ng-icons/core';
import { lucideStar } from '@ng-icons/lucide';

@Component({
  selector: 'app-books-card',
  standalone: true,
  imports: [
    HlmCardDirective,
    HlmIconComponent,
    NgTemplateOutlet,
    AverageRatingPipe,
  ],
  providers: [provideIcons({ lucideStar })],
  templateUrl: './books-card.component.html',
  styleUrl: './books-card.component.scss',
})
export class BooksCardComponent {
  public readonly hlmH3 = hlmH3;
  public readonly hlmSmall = hlmSmall;
  public readonly hlmMuted = hlmMuted;
  @Input() book?: Book;
}

import { Pipe, PipeTransform } from '@angular/core';
import { Rating } from '../../../types/types';

@Pipe({
  name: 'averageRating',
  standalone: true,
})
export class AverageRatingPipe implements PipeTransform {
  transform(ratings: Rating[]): number | null {
    if (!ratings || ratings.length === 0) {
      return 0;
    }
    const total = ratings.reduce((sum, rating) => sum + rating.value, 0);
    return Math.round((total / ratings.length) * 10) / 10;
  }
}

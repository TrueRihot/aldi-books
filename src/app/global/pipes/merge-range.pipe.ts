import { Pipe, PipeTransform } from '@angular/core';

/**
 * @ngdoc pipe
 * @name mergeRange
 * @description
 * A custom Angular pipe that merges a range of years into a single string.
 *
 * @example
 * <!-- In a template -->
 * {{ '2020-2021 - 2022-2023' | mergeRange }} <!-- Outputs: '2020-2023' -->
 */
@Pipe({
  name: 'mergeRange',
  standalone: true,
})
export class MergeRangePipe implements PipeTransform {
  /**
   * Transforms a string containing a range of years into a single merged range.
   *
   * @param {string} value - The input string containing the range of years.
   * @returns {string} - The merged range of years.
   */
  transform(value: string): string {
    if (!value) return value;

    const ranges = value.split(' - ');
    const firstYear = ranges[0].split('-')[0];
    const lastYear = ranges[ranges.length - 1].split('-')[1];

    return `${firstYear}-${lastYear}`;
  }
}

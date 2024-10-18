import { Component, ViewChild } from '@angular/core';
import { HlmButtonDirective } from '../ui-button-helm/src';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '../ui-dialog-helm/src';
import {
  BrnDialogContentDirective,
  BrnDialogState,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import { HlmLabelDirective } from '../ui-label-helm/src';
import { HlmInputDirective } from '../ui-input-helm/src';
import { HlmFormFieldComponent } from '../ui-formfield-helm/src';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Book } from '../../../../types/types';
import { DataService } from '../../services/data.service';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmDialogComponent,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmLabelDirective,
    HlmInputDirective,
    HlmDialogFooterComponent,
    HlmFormFieldComponent,
    ReactiveFormsModule,
    HlmSpinnerComponent,
  ],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.scss',
})
export class AddBookComponent {
  @ViewChild(HlmDialogComponent) dialog!: HlmDialogComponent;
  public loading = false;
  public form = new FormGroup({
    name: new FormControl<string>(
      { value: '', disabled: false },
      { validators: [Validators.required, Validators.minLength(3)] }
    ),
    author: new FormControl<string>(
      { value: '', disabled: false },
      { validators: [Validators.required, Validators.minLength(3)] }
    ),
    category: new FormControl<string>(
      { value: '', disabled: false },
      { validators: [Validators.required, Validators.minLength(3)] }
    ),
    publishYear: new FormControl<number | null>(
      { value: null, disabled: false },
      {
        validators: [
          Validators.required,
          Validators.max(new Date().getFullYear()),
        ],
      }
    ),
  });

  constructor(private dataService: DataService) {}

  onSubmit() {
    if (this.form.valid) {
      const book: Book = this.form.value as Book;
      this.loading = true;
      this.dataService.postBook(book).subscribe(() => {
        this.loading = false;
        this.form.reset();
        this.dataService.getLatestBooks();
        this.dialog.close(null, 0);
      });
    }
  }
}

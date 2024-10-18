import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { hlmH1 } from '../ui-typography-helm/src';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {}

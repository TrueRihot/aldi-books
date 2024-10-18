import { Component, OnInit } from '@angular/core';
import { HlmButtonDirective } from '../ui-button-helm/src';
import { BrnToggleDirective } from '@spartan-ng/ui-toggle-brain';
import { HlmIconComponent } from '../ui-icon-helm/src';
import { HlmToggleDirective } from '../ui-toggle-helm/src';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HlmButtonDirective,
    BrnToggleDirective,
    HlmIconComponent,
    HlmToggleDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [provideIcons({ lucideMoon, lucideSun })],
})
export class HeaderComponent implements OnInit {
  public isDarkModeToggled: 'on' | 'off' = 'on';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkModeToggled = theme === 'dark' ? 'on' : 'off';
    });
  }

  handleDarkModeToggle(mode: 'on' | 'off'): void {
    this.themeService.toggleDarkMode();
  }
}

import { inject, Injectable, OnDestroy, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Service to manage the theme (light/dark) of the application.
 * It synchronizes the theme with local storage and updates the DOM accordingly.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _renderer = inject(RendererFactory2).createRenderer(null, null);
  private readonly _document = inject(DOCUMENT);
  private readonly _theme$ = new ReplaySubject<'light' | 'dark'>(1);
  public theme$ = this._theme$.asObservable();
  private readonly _destroyed$ = new Subject<void>();

  constructor() {
    this.syncThemeFromLocalStorage();
    this.toggleClassOnThemeChanges();
  }

  /**
   * Synchronizes the theme from local storage.
   * If the theme is not set in local storage, it defaults to 'light'.
   */
  private syncThemeFromLocalStorage(): void {
    if (isPlatformBrowser(this._platformId)) {
      const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
      this._theme$.next(theme);
    }
  }

  /**
   * Subscribes to theme changes and updates the DOM class accordingly.
   * Adds the 'dark' class if the theme is 'dark', otherwise removes it.
   */
  private toggleClassOnThemeChanges(): void {
    this.theme$.pipe(takeUntil(this._destroyed$)).subscribe((theme) => {
      const classList = this._document.documentElement.classList;
      theme === 'dark' ? classList.add('dark') : classList.remove('dark');
    });
  }

  /**
   * Toggles the theme between 'light' and 'dark'.
   * Updates the local storage and emits the new theme.
   */
  public toggleDarkMode(): void {
    const newTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    this._theme$.next(newTheme);
  }

  /**
   * Cleans up the subscriptions when the service is destroyed.
   */
  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

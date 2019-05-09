import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { defaultTheme, Theme } from './theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _theme = new BehaviorSubject<Theme>(defaultTheme);
  readonly theme$ = this._theme.asObservable();

  constructor() { }

  get theme(): Theme {
    return this._theme.getValue();
  }
  set theme(theme: Theme) {
    this._theme.next(theme);
  }

}

import { TestBed, fakeAsync } from '@angular/core/testing';

import { ThemeService } from './theme.service';
import { defaultTheme, colorThemes } from './theme';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });

    service = new ThemeService();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  describe('theme', () => {
    it('should initially return the defaultTheme', () => {
      expect(service.theme).toEqual(defaultTheme);
    });

    it('setting the theme should return it', () => {
      service.theme = colorThemes[1];

      expect(service.theme).toEqual(colorThemes[1]);
    });

    it('theme$ should be an Observable of theme', fakeAsync(() => {
      let theme;
      service.theme$.subscribe(e => { theme = e; });
      expect(theme).toEqual(defaultTheme);
      service.theme = colorThemes[1];
      expect(theme).toEqual(colorThemes[1]);
    }));
  });
});

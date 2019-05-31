import { Theme, colorThemes, defaultTheme } from './theme';

describe('Theme', () => {
  it('should create an instance', () => {
    expect(new Theme()).toBeTruthy();
  });

  it('colorThemes should return an array of themes', () => {
    expect(colorThemes).toBeDefined();
  });

  it('defaultTheme should return a theme', () => {
    expect(defaultTheme).toBeDefined();
  });
});

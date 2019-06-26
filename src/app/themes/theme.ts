export class Theme {
  mainClass: string;
  backgroundClass: string;
  componentClass: string;
}

export const colorThemes: Theme[] = [
  {
    mainClass: 'light-indigo-pink',
    componentClass: 'light-indigo-pink-colors',
    backgroundClass: 'light-theme-background'
  },
  {
    mainClass: 'light-teal-orange',
    componentClass: 'light-teal-orange-colors',
    backgroundClass: 'light-theme-background'
  },
  {
    mainClass: 'light-purple-blue',
    componentClass: 'light-purple-blue-colors',
    backgroundClass: 'light-theme-background'
  },
  {
    mainClass: 'dark-deep-orange-yellow',
    componentClass: 'dark-deep-orange-yellow-colors',
    backgroundClass: 'dark-theme-background'
  },
  {
    mainClass: 'dark-cyan-amber',
    componentClass: 'dark-cyan-amber-colors',
    backgroundClass: 'dark-theme-background'
  }
];

export const defaultTheme: Theme = colorThemes[0];

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NewGameForm } from './new-game-form';
import { ThemeService } from '../themes/theme.service';
import { colorThemes, Theme } from '../themes/theme';

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrls: ['./new-game-dialog.component.scss']
})
export class NewGameDialogComponent {
  colorThemes: Theme[] = colorThemes;

  constructor(
    public themeService: ThemeService,
    public dialogRef: MatDialogRef<NewGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewGameForm
  ) { }

  cancel(): void {
    this.dialogRef.close();
  }

  checkTheme(theme: Theme): void {
    this.themeService.theme = theme;
    this.data.colorTheme = theme;
  }

}

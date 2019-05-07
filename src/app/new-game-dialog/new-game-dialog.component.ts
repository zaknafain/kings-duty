import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NewGameForm } from './new-game-form';

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrls: ['./new-game-dialog.component.scss']
})
export class NewGameDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NewGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewGameForm
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

}

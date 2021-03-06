import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { TileComponent } from './map/tiles/tile.component';
import { GameTimePipe } from './time/game-time.pipe';
import { NewGameDialogComponent } from './new-game-dialog/new-game-dialog.component';
import { EventDialogComponent } from './event-dialog/event-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TileComponent,
    GameTimePipe,
    NewGameDialogComponent,
    EventDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSliderModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    NewGameDialogComponent,
    EventDialogComponent
  ]
})
export class AppModule { }

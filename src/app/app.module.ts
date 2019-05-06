import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { TileComponent } from './map/tile/tile.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

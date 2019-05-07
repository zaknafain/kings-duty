import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Realm } from './realm/realm';
import { NewGameForm } from './new-game-dialog/new-game-form';
import { TileService } from './map/tile/tile.service';
import { TimeService } from './time/time.service';
import { DataService } from './data/data.service';
import { RealmService } from './realm/realm.service';

import { NewGameDialogComponent } from './new-game-dialog/new-game-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    './floating-elements.scss'
  ]
})
export class AppComponent {
  visibleRadius = 3;
  realm: Realm;

  constructor(
    private tileService: TileService,
    private timeService: TimeService,
    private dataService: DataService,
    private realmService: RealmService,
    private matDialog: MatDialog
  ) {
    this.realmService.playerRealm$.subscribe(realm => {
      this.realm = realm;
    });
    this.tileService.tiles$.subscribe(tiles => {
      this.realm.size = tiles.filter(tile => tile.owner === this.realm.ruler).length;
    });
    if (!this.dataService.hasData) { this.newGame(); }
  }

  newGame(): void {
    const dialogRef = this.matDialog.open(NewGameDialogComponent, {
      data: {
        visibleRadius: this.visibleRadius,
        realmName: this.realm.name,
        rulerName: this.realm.ruler
      }
    });

    dialogRef.afterClosed().subscribe((result: NewGameForm) => {
      if (result) {
        this.realmService.playerRealm = {
          name: result.realmName,
          ruler: result.rulerName,
          size: 0
        };
        this.visibleRadius = result.visibleRadius;
        this.renewMap();
      }
    });
  }

  private renewMap(): void {
    this.tileService.generateMap(this.visibleRadius);
    this.tileService.claimTile(this.tileService.tiles.find(t => t.x === 0 && t.y === 0), this.realm.ruler);
    this.timeService.resetTime();
  }
}

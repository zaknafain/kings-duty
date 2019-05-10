import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Realm } from './realms/realm';
import { NewGameForm } from './new-game-dialog/new-game-form';
import { TileService } from './map/tiles/tile.service';
import { TimeService } from './time/time.service';
import { DataService } from './save-games/data.service';
import { RealmService } from './realms/realm.service';

import { NewGameDialogComponent } from './new-game-dialog/new-game-dialog.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './themes/theme.service';
import { Theme, defaultTheme } from './themes/theme';

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
  theme: Theme = defaultTheme;

  constructor(
    private matDialog: MatDialog,
    public overlayContainer: OverlayContainer,
    private tileService: TileService,
    private timeService: TimeService,
    private dataService: DataService,
    private realmService: RealmService,
    private themeService: ThemeService
  ) {
    this.themeService.theme$.subscribe(theme => {
      if (this.theme !== theme && theme !== undefined) {
        this.switchTheme(theme);
      }
    });
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
        rulerName: this.realm.ruler,
        colorTheme: this.theme
      }
    });

    dialogRef.afterClosed().subscribe((result: NewGameForm) => {
      if (result) {
        this.realmService.playerRealm = {
          name: result.realmName,
          ruler: result.rulerName,
          size: 0,
        };
        this.themeService.theme = result.colorTheme;
        this.visibleRadius = result.visibleRadius;
        this.renewMap();
      }
    });
  }

  private switchTheme(theme: Theme): void {
    this.overlayContainer.getContainerElement().parentElement.classList.remove(this.theme.mainClass);
    this.overlayContainer.getContainerElement().parentElement.classList.add(theme.mainClass);
    this.theme = theme;
  }

  private renewMap(): void {
    this.tileService.generateMap(this.visibleRadius);
    this.tileService.claimTile(this.tileService.tiles.find(t => t.x === 0 && t.y === 0), this.realm.ruler);
    this.timeService.resetTime();
  }
}

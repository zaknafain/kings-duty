import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Tile } from './map/tiles/tile';
import { Realm } from './realms/realm';
import { NewGameForm } from './new-game-dialog/new-game-form';
import { Theme, defaultTheme } from './themes/theme';
import { TimeEvent, TimeEventAction } from './events/time-event';
import { TileService } from './map/tiles/tile.service';
import { TimeService } from './time/time.service';
import { DataService } from './save-games/data.service';
import { RealmService } from './realms/realm.service';
import { ThemeService } from './themes/theme.service';
import { EventService } from './events/event.service';
import { PopulationService } from './map/tiles/population.service';

import { NewGameDialogComponent } from './new-game-dialog/new-game-dialog.component';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { OverlayContainer } from '@angular/cdk/overlay';

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
    private themeService: ThemeService,
    private eventService: EventService,
    private populationService: PopulationService
  ) {
    this.themeService.theme$.subscribe(theme => {
      if (this.theme !== theme) {
        this.switchTheme(theme);
      }
    });
    this.realmService.playerRealm$.subscribe(realm => {
      this.realm = realm;
    });
    this.tileService.tiles$.subscribe(tiles => {
      const ownedTiles: Tile[] = tiles.filter(tile => tile.owner === this.realm.ruler);

      this.realm.size = ownedTiles.length;
      this.realm.people = ownedTiles.map(tile => tile.people).reduce((a, b) => a + b, 0);
    });
    this.eventService.currentEvent$.subscribe(event => {
      if (event !== undefined) {
        this.timeService.stopTime();
        this.showEventDialog(event);
      }
    });
    if (!this.dataService.hasData) { this.showNewGameDialog(); }
  }

  private showNewGameDialog(): void {
    const dialogRef = this.matDialog.open(NewGameDialogComponent, {
      data: {
        visibleRadius: this.visibleRadius,
        realmName: this.realm.name,
        rulerName: this.realm.ruler,
        colorTheme: this.theme
      }
    });

    dialogRef.afterClosed().subscribe((result: NewGameForm) => {
      if (result) { this.newGame(result); }
    });
  }

  private showEventDialog(event: TimeEvent): void {
    const dialogRef = this.matDialog.open(EventDialogComponent, {
      data: event,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: TimeEventAction) => {
      this.eventService.resolveEvent(result);
    });
  }

  private switchTheme(theme: Theme): void {
    this.overlayContainer.getContainerElement().parentElement.classList.remove(this.theme.mainClass);
    this.overlayContainer.getContainerElement().parentElement.classList.add(theme.mainClass);
    this.theme = theme;
  }

  private newGame(gameData: NewGameForm): void {
    this.realmService.playerRealm = {
      name: gameData.realmName,
      ruler: gameData.rulerName,
      size: 0,
    };
    this.themeService.theme = gameData.colorTheme;
    this.visibleRadius = gameData.visibleRadius;
    this.tileService.generateMap(this.visibleRadius);
    this.tileService.claimTile(0, 0, this.realm.ruler);
    this.timeService.resetTime();
    this.eventService.createInitialEvents();
    this.populationService.startPopulationGrowth();
  }
}

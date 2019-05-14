import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SaveGame } from './save-game';
import { TileService } from '../map/tiles/tile.service';
import { TimeService } from '../time/time.service';
import { RealmService } from '../realms/realm.service';
import { ThemeService } from '../themes/theme.service';
import { EventService } from '../events/event.service';

const storageKeyName = 'saveGame';
const currentVersion = '0.1';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly _saved = new BehaviorSubject<boolean>(false);
  readonly saved$ = this._saved.asObservable();
  private readonly _hasData = new BehaviorSubject<boolean>(false);
  readonly hasData$ = this._hasData.asObservable();

  constructor(
    private tileService: TileService,
    private timeService: TimeService,
    private realmService: RealmService,
    private themeService: ThemeService,
    private eventService: EventService
  ) {
    if (localStorage.getItem(storageKeyName)) {
      this.hasData = true;
      this.load();
    }
    this.tileService.tiles$.subscribe(() => this.saved = false);
    this.timeService.days$.subscribe(() => this.saved = false);
    this.realmService.playerRealm$.subscribe(() => this.saved = false);
    this.themeService.theme$.subscribe(() => this.saved = false);
  }

  get saved(): boolean {
    return this._saved.getValue();
  }
  set saved(saved: boolean) {
    this._saved.next(saved);
  }

  get hasData(): boolean {
    return this._hasData.getValue();
  }
  set hasData(hasData: boolean) {
    this._hasData.next(hasData);
  }

  save(): void {
    localStorage.setItem(storageKeyName, this.createDataJSON(currentVersion));
    this.saved = true;
    this.hasData = true;
  }

  load(): void {
    this.loadDataJSON(localStorage.getItem(storageKeyName));
    this.saved = true;
  }

  private createDataJSON(version: string): string {
    if (version === currentVersion) { return this.createVersionCurrent(); }
  }

  private loadDataJSON(json: string): void {
    const data: SaveGame = JSON.parse(json);

    if (data.version === currentVersion) { this.loadVersionCurrent(data); }
  }

  private createVersionCurrent(): string {
    const data = {
      version: currentVersion,
      tiles: this.tileService.tiles,
      days: this.timeService.days,
      realm: this.realmService.playerRealm,
      theme: this.themeService.theme,
      events: this.eventService.events
    };

    return JSON.stringify(data);
  }

  private loadVersionCurrent(data: SaveGame): void {
    this.tileService.tiles = data.tiles;
    this.timeService.days = data.days;
    this.realmService.playerRealm = data.realm;
    this.themeService.theme = data.theme;
    this.eventService.events = data.events;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { TileService } from '../map/tile/tile.service';
import { TimeService } from '../time/time.service';
import { SaveGame } from './save-game';

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
    private timeService: TimeService
  ) {
    if (localStorage.getItem('tiles')) { this.hasData = true; }
    this.tileService.tiles$.subscribe(() => this.saved = false);
    this.timeService.days$.subscribe(() => this.saved = false);
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
      days: this.timeService.days
    };

    return JSON.stringify(data);
  }

  private loadVersionCurrent(data: SaveGame): void {
    this.tileService.tiles = data.tiles;
    this.timeService.days = data.days;
  }
}

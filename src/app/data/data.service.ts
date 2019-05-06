import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { TileService } from '../map/tile/tile.service';
import { TimeService } from '../time/time.service';

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
    localStorage.setItem('tiles', JSON.stringify(this.tileService.tiles));
    localStorage.setItem('days', JSON.stringify(this.timeService.days));
    this.saved = true;
    this.hasData = true;
  }

  load(): void {
    this.tileService.tiles = JSON.parse(localStorage.getItem('tiles'));
    this.timeService.days = JSON.parse(localStorage.getItem('days'));
    this.saved = true;
  }
}

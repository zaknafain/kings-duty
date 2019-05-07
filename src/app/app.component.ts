import { Component, OnInit } from '@angular/core';
import { TileService } from './map/tile/tile.service';
import { TimeService } from './time/time.service';
import { DataService } from './data/data.service';
import { Realm } from './realm/realm';
import { RealmService } from './realm/realm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    './floating-elements.scss'
  ]
})
export class AppComponent implements OnInit {
  visibleRadius = 3;
  realm: Realm;

  constructor(
    private tileService: TileService,
    private timeService: TimeService,
    private dataService: DataService,
    private realmService: RealmService
  ) {
    this.realm = this.realmService.playerRealm;
    this.tileService.tiles$.subscribe(tiles => {
      this.realm.size = tiles.filter(tile => tile.owner === this.realm.ruler).length;
    });
  }

  ngOnInit() {
    if (!this.dataService.hasData) {
      this.renewMap();
    }
  }

  renewMap(): void {
    this.tileService.generateMap(this.visibleRadius);
    this.tileService.claimTile(this.tileService.tiles.find(t => t.x === 0 && t.y === 0), this.realm.ruler);
    this.timeService.resetTime();
  }
}

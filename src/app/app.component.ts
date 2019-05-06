import { Component, OnInit } from '@angular/core';
import { TileService } from './map/tile/tile.service';
import { TimeService } from './time/time.service';
import { DataService } from './data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    './floating-elements.scss'
  ]
})
export class AppComponent implements OnInit {
  title = 'kings-duty';
  visibleRadius = 3;
  player = 'Super duper king';
  realmSize: number;

  constructor(
    private tileService: TileService,
    private timeService: TimeService,
    private dataService: DataService
  ) {
    this.tileService.tiles$.subscribe(tiles => {
      this.realmSize = tiles.filter(tile => tile.owner === this.player).length;
    });
  }

  ngOnInit() {
    this.renewMap();
  }

  renewMap(): void {
    this.tileService.generateMap(this.visibleRadius);
    this.tileService.claimTile(this.tileService.tiles.find(t => t.x === 0 && t.y === 0), this.player);
    this.timeService.resetTime();
  }
}

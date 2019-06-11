import { Injectable } from '@angular/core';

import { TileService } from './tile.service';
import { TimeService } from 'src/app/time/time.service';
import { Tile } from './tile';

export const GROWTH_CYCLE_PERIOD = 10;

@Injectable({
  providedIn: 'root'
})
export class PopulationService {

  constructor(
    private tileService: TileService,
    private timeService: TimeService
  ) { }

  startPopulationGrowth(): void {
    this.timeService.days$.subscribe(day => {
      if (day % GROWTH_CYCLE_PERIOD === 1) {
        const tiles = this.tileService.tiles.filter(tile => tile.people > 0);
        this.calculateTotalPopulationGrowth(tiles);
      }
    });
  }

  calculateTotalPopulationGrowth(tiles: Tile[]): void {
    tiles.forEach(tile => {
      this.tileService.addPopulation(
        tile.x,
        tile.y,
        this.calculatePopulationGrowth(tile)
      );
    });
  }

  calculatePopulationGrowth(tile: Tile): number {
    const growth = this.calculateGrowth(tile.people);

    return growth / (364 / GROWTH_CYCLE_PERIOD);
  }

  calculateGrowth(people: number): number {
    return people * 0.003;
  }
}

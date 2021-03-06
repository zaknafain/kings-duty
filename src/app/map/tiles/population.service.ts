import { Injectable } from '@angular/core';

import { TileService } from './tile.service';
import { TimeService } from 'src/app/time/time.service';
import { EventService } from 'src/app/events/event.service';
import { Tile } from './tile';
import { PeopleFeelCrowdedEvent } from 'src/app/events/time-event';

export const GROWTH_CYCLE_PERIOD = 10;

@Injectable({
  providedIn: 'root'
})
export class PopulationService {

  constructor(
    private tileService: TileService,
    private timeService: TimeService,
    private eventService: EventService
  ) {
    this.timeService.days$.subscribe(day => {
      if (day % GROWTH_CYCLE_PERIOD === 1) {
        let tiles = this.tileService.tiles.filter(tile => tile.people >= 1000);
        this.startMigrationEvents(tiles);
        tiles = this.tileService.tiles.filter(tile => tile.people > 0);
        this.calculateTotalPopulationGrowth(tiles);
      }
    });
  }

  startMigrationEvents(tiles: Tile[]): void {
    tiles.forEach(tile => {
      const randomDay = this.timeService.days + Math.floor(Math.random() * 5) + 1;
      this.eventService.addEvent(
        new PeopleFeelCrowdedEvent(randomDay, tile.x, tile.y)
      );
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

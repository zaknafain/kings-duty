import { Injectable } from '@angular/core';
import { Tile } from './tile';
import { terrainTypes, Terrain } from './terrain';
import { Region } from '../region';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TileService {
  private readonly _tiles = new BehaviorSubject<Tile[]>([]);
  readonly tiles$ = this._tiles.asObservable();
  regions: Array<Region>;

  constructor() { }

  get tiles(): Tile[] {
    return this._tiles.getValue();
  }
  set tiles(tiles: Tile[]) {
    this._tiles.next(tiles);
  }

  revealTile(tile: Tile): void {
    this.tiles.find(t => t.x === tile.x && t.y === tile.y).isKnown = true;
    this.tiles = [...this.tiles];

    if (this.tiles.findIndex(t => t.y > tile.y) < 0) {
      this.addTile(tile.x, tile.y + 1);
    }
    if (this.tiles.findIndex(t => t.y < tile.y) < 0) {
      this.addTile(tile.x, tile.y - 1);
    }

    if (this.tiles.findIndex(t => t.x > tile.x) < 0) {
      this.addTile(tile.x + 1, tile.y);
    }
    if (this.tiles.findIndex(t => t.x < tile.x) < 0) {
      this.addTile(tile.x - 1, tile.y);
    }
  }

  generateMap(visibileRadius: number): void {
    this.regions = [{ type: 'grassland', size: 1, name: 'grassland00' }];
    const initialTile: Tile = {
      x: 0,
      y: 0,
      terrain: 'grassland',
      isKnown: false,
      region: 'grassland00',
      people: this.randomStartingPeople()
    };
    this.tiles = [initialTile];
    this.revealTile(initialTile);

    let connectors: Tile[] = [initialTile];
    for (let i = 1; i <= visibileRadius; i++) {
      let nextConnectors: Tile[] = [];
      connectors.forEach(c => {
        nextConnectors = [...nextConnectors, ...this.revealConnecters(c)];
      });
      connectors = nextConnectors;
    }
  }

  claimTile(x: number, y: number, ruler: string): void {
    this.tiles.find(t => t.x === x && t.y === y).owner = ruler;

    this.tiles = [...this.tiles];
  }

  addPopulation(x: number, y: number, people: number): void {
    const currentPeople = this.tiles.find(t => t.x === x && t.y === y).people || 0;
    const newPeople = currentPeople + people;

    this.tiles.find(t => t.x === x && t.y === y).people = newPeople;

    this.tiles = [...this.tiles];
  }

  removePopulation(x: number, y: number, people: number): void {
    const currentPeople = this.tiles.find(t => t.x === x && t.y === y).people || 0;
    const newPeople = (currentPeople - people >= 0) ? currentPeople - people : 0;

    this.tiles.find(t => t.x === x && t.y === y).people = newPeople;

    this.tiles = [...this.tiles];
  }

  addTile(x: number, y: number): void {
    const newTiles: Tile[] = [];

    if (this.tiles.findIndex(tile => tile.y === y) < 0) {
      const rowZero = this.tiles.filter(tile => tile.y === 0);
      const fromPosition = rowZero[0].x;
      const toPosition = rowZero[rowZero.length - 1].x;

      for (let i = fromPosition; i <= toPosition; i++) {
        newTiles.push(this.generateTile(i, y));
      }
    } else if (this.tiles.findIndex(tile => tile.x === x) < 0) {
      const columnZero = this.tiles.filter(tile => tile.x === 0);
      const fromPosition = columnZero[columnZero.length - 1].y;
      const toPosition = columnZero[0].y;

      for (let i = fromPosition; i <= toPosition; i++) {
        newTiles.push(this.generateTile(x, i));
      }
    }
    const newMap = [...this.tiles, ...newTiles];

    this.tiles = newMap.sort((a: Tile, b: Tile) => this.sortTiles(a, b));
  }

  getConnecters(tile: Tile): Array<Tile> {
    return this.tiles.filter(t => {
      return t.x === tile.x - 1 && t.y === tile.y // one left
        || t.x === tile.x + 1 && t.y === tile.y // one right
        || t.x === tile.x && t.y === tile.y - 1 // one down
        || t.x === tile.x && t.y === tile.y + 1 // one up
        || (t.y === tile.y - 1 || t.y === tile.y + 1) && // up and down and one to the side
           (tile.y % 2 === 0 && t.x === tile.x - 1 || tile.y % 2 !== 0 && t.x === tile.x + 1);
    });
  }

  revealConnecters(tile: Tile): Tile[] {
    const connectors = this.getConnecters(tile);
    connectors.forEach(c => this.revealTile(c));

    return connectors;
  }

  sortTiles(a: Tile, b: Tile): number {
    let sort = b.y - a.y;

    if (sort === 0) { sort = a.x - b.x; }

    return sort;
  }

  generateTile(x: number, y: number): Tile {
    const tile: Tile = { x, y , isKnown: false };
    const connectors: Array<Tile> = this.getConnecters(tile);
    const connectedRegions: Region[] = this.regions.filter(r => connectors.some(c => c.region === r.name));

    connectedRegions.forEach(region => {
      const terrainType = terrainTypes.find(tt => tt.label === region.type);
      if (region.size > terrainType.regionSizeMax) {
        region.pressure = terrainType.regionSizeMax - region.size;
      } else if (region.size > terrainType.regionSizeMin) {
        region.pressure = terrainType.regionSizeMax - region.size;
      } else {
        region.pressure = (terrainType.regionSizeMin - region.size) * 5;
      }
    });

    const terrain = this.randomTerrain(connectedRegions);
    tile.terrain = terrain.label;
    const matchingCon: Tile = connectors.find(c => c.terrain === tile.terrain);

    if (matchingCon) {
      tile.region = matchingCon.region;
      this.regions.find(r => r.name === tile.region).size++;
    } else {
      const newRegion = { type: tile.terrain, size: 1, name: `${tile.terrain}${tile.x}${tile.y}` };
      this.regions.push(newRegion);
      tile.region = newRegion.name;
    }

    return tile;
  }

  randomTerrain(connectedRegions: Region[]): Terrain {
    let totalWeight = 0;
    let returnType: Terrain;

    terrainTypes.forEach(tt => {
      const region = connectedRegions.find(cr => cr.type === tt.label);
      if (region) {
        totalWeight += region.pressure;
      } else {
        totalWeight += tt.weight;
      }
    });

    let random = Math.floor(Math.random() * totalWeight);
    terrainTypes.forEach(tt => {
      const region = connectedRegions.find(cr => cr.type === tt.label);
      if (region) {
        random -= region.pressure;
      } else {
        random -= tt.weight;
      }

      if (returnType === undefined && random <= 0) {
        returnType = tt;
      }
    });

    return returnType || terrainTypes[terrainTypes.length - 1];
  }

  randomStartingPeople(): number {
    return (Math.random() * 500) + 500;
  }
}

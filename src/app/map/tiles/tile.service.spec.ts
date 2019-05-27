import { TestBed, fakeAsync } from '@angular/core/testing';

import { TileService } from './tile.service';
import { Tile } from './tile';
import { terrainTypes } from './terrain';

describe('TileService', () => {
  let service: TileService;
  const tile: Tile = {
    isKnown: false,
    owner: 'owner',
    people: 1234,
    region: 'plains-region',
    terrain: 'plains',
    x: 0,
    y: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new TileService();
  });


  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  describe('tiles', () => {
    it('should initially return no tiles', () => {
      expect(service.tiles).toEqual([]);
    });

    it('setting tiles should return them', () => {
      service.tiles = [tile];

      expect(service.tiles).toEqual([tile]);
    });

    it('tiles$ should be an Observable of tiles', fakeAsync(() => {
      let tiles = [];
      service.tiles$.subscribe(t => { tiles = t; });
      expect(tiles).toEqual([]);
      service.tiles = [tile];
      expect(tiles).toEqual([tile]);
    }));
  });

  describe('revealTile', () => {
    beforeEach(() => {
      service.tiles = [{ ...tile }];
      service.regions = [{ name: tile.region, size: 1, type: tile.terrain }];
    });

    it('should set the attribute isKnown to true', () => {
      service.tiles.forEach(t => { expect(t.isKnown).toBe(false); });
      service.revealTile(tile);

      expect(service.tiles.find(t => t.x === tile.x && t.y === tile.y).isKnown).toBe(true);
    });

    it('should create more not known tiles around the revealed one', () => {
      expect(service.tiles.length).toBe(1);

      service.revealTile(tile);

      expect(service.tiles.length).toBe(9);
      expect(service.tiles.filter(t => t.isKnown === false).length).toBe(8);
    });

    it('should assign the same region to connecting tiles with the same terrain type', () => {
      service.revealTile(tile);

      const sameTerrainTiles = service.getConnecters(tile).filter(t => t.terrain === tile.terrain);
      sameTerrainTiles.forEach(stt => { expect(stt.region).toBe(tile.region); });
    });

    it('should call the next handler of the tiles observable', () => {
      let tiles = [];
      service.tiles$.subscribe(t => tiles = t);

      tiles.forEach(t => { expect(t.isKnown).toBe(false); });

      service.revealTile(tile);

      expect(tiles.find(t => t.x === tile.x && t.y === tile.y).isKnown).toBe(true);
      expect(tiles.filter(t => t.isKnown === false).length).toBe(8);
    });
  });

  describe('generateMap', () => {
    it('should create a new map with a minimum of 9 tiles', () => {
      expect(service.tiles.length).toBe(0);

      service.generateMap(0);

      expect(service.tiles.length).toBe(9);
    });

    it('should create a bigger map with higher visibilityRadius given', () => {
      service.generateMap(1);

      expect(service.tiles.length).toBe(25);

      service.generateMap(2);

      expect(service.tiles.length).toBe(49);
    });

    it('should create a map with the center being known', () => {
      service.generateMap(0);

      expect(service.tiles.filter(t => t.isKnown === true).length).toBe(1);
    });

    it('should create a map with more tiles being known when raising the visibilityRadius', () => {
      service.generateMap(1);

      expect(service.tiles.filter(t => t.isKnown === true).length).toBe(7);
    });

    it('should call the next handler of the tiles observable', () => {
      let tiles = [];
      service.tiles$.subscribe(t => tiles = t);
      service.generateMap(0);

      expect(tiles.length).toBe(9);
    });
  });

  describe('claimTile', () => {
    beforeEach(() => {
      service.tiles = [{ ...tile }];
    });

    it('should change the owner of the given tile', () => {
      service.tiles.forEach(t => { expect(t.owner).toBe(tile.owner); });

      service.claimTile(tile.x, tile.y, 'NewOwner');

      service.tiles.forEach(t => { expect(t.owner).toBe('NewOwner'); });
    });

    it('should call the next handler of the tiles observable', () => {
      let tiles = [];
      service.tiles$.subscribe(t => tiles = t);

      tiles.forEach(t => { expect(t.owner).toBe('owner'); });

      service.claimTile(tile.x, tile.y, 'NewOwner');

      tiles.forEach(t => { expect(t.owner).toBe('NewOwner'); });
    });
  });

  describe('addPopulation', () => {
    beforeEach(() => {
      service.tiles = [{ ...tile }];
    });

    it('should add the given amout of people to the tile', () => {
      service.tiles.forEach(t => { expect(t.people).toBe(tile.people); });

      service.addPopulation(tile.x, tile.y, 1234);

      service.tiles.forEach(t => { expect(t.people).toBe(2468); });
    });

    it('should call the next handler of the tiles observable', () => {
      let tiles = [];
      service.tiles$.subscribe(t => tiles = t);

      tiles.forEach(t => { expect(t.people).toBe(1234); });

      service.addPopulation(tile.x, tile.y, 1234);

      tiles.forEach(t => { expect(t.people).toBe(2468); });
    });
  });

  describe('addTile', () => {
    beforeEach(() => {
      service.generateMap(0);
    });

    it('should do nothing if the tile already exists', () => {
      service.addTile(0, 0);

      expect(service.tiles.length).toBe(9);
    });

    it('should create a complete row of tiles if there is none below', () => {
      service.addTile(0, -2);

      expect(service.tiles.length).toBe(12);
      expect(service.tiles.filter(t => t.y === -2).length).toBe(3);
    });

    it('should create a complete row of tiles if there is none above', () => {
      service.addTile(0, 2);

      expect(service.tiles.length).toBe(12);
      expect(service.tiles.filter(t => t.y === 2).length).toBe(3);
    });

    it('should create a complete column of tiles if there is none to the right', () => {
      service.addTile(2, 0);

      expect(service.tiles.length).toBe(12);
      expect(service.tiles.filter(t => t.x === 2).length).toBe(3);
    });

    it('should create a complete column of tiles if there is none to the left', () => {
      service.addTile(-2, 0);

      expect(service.tiles.length).toBe(12);
      expect(service.tiles.filter(t => t.x === -2).length).toBe(3);
    });
  });

  describe('getConnecters', () => {
    let centerTile;

    beforeEach(() => {
      service.generateMap(0);
      centerTile = service.tiles.find(t => t.x === 0 && t.y === 0);
    });

    it('should return 6 tiles which are connecting', () => {
      const connecters = service.getConnecters(centerTile);

      expect(connecters.length).toBe(6);
      expect(connecters).toContain(service.tiles.find(t => t.x === 1 && t.y === 0));
      expect(connecters).toContain(service.tiles.find(t => t.x === 0 && t.y === 1));
      expect(connecters).toContain(service.tiles.find(t => t.x === -1 && t.y === 1));
      expect(connecters).toContain(service.tiles.find(t => t.x === -1 && t.y === 0));
      expect(connecters).toContain(service.tiles.find(t => t.x === -1 && t.y === -1));
      expect(connecters).toContain(service.tiles.find(t => t.x === 0 && t.y === -1));
    });

    it('should return only 2 connecters if tile given is corner', () => {
      const edge = service.tiles.find(t => t.x === 1 && t.y === 1);
      const connecters = service.getConnecters(edge);

      expect(connecters.length).toBe(2);
      expect(connecters).toContain(service.tiles.find(t => t.x === 1 && t.y === 0));
      expect(connecters).toContain(service.tiles.find(t => t.x === 0 && t.y === 1));
    });

    it('should not return the given tile', () => {
      expect(service.getConnecters(centerTile)).not.toContain(centerTile);
    });
  });

  describe('revealConnecters', () => {
    let centerTile;

    beforeEach(() => {
      service.generateMap(0);
      centerTile = service.tiles.find(t => t.x === 0 && t.y === 0);
    });

    it('should reveal only the connected tiles', () => {
      service.revealConnecters(centerTile);
      const connecters = service.getConnecters(centerTile);

      connecters.forEach(c => { expect(c.isKnown).toBe(true); });
      service.tiles.filter(c => c.isKnown === true).forEach(knownTile => {
        expect([ ...connecters, centerTile ]).toContain(knownTile);
      });
    });

    it('should expand the map', () => {
      service.revealConnecters(centerTile);

      expect(service.tiles.length).toBe(25);
      expect(service.tiles.filter(t => t.isKnown === true).length).toBe(7);
    });

    it('should call the next handler of the tiles observable', () => {
      let tiles = [];
      service.tiles$.subscribe(t => tiles = t);

      expect(tiles.filter(t => t.isKnown === true).length).toBe(1);

      service.revealConnecters(centerTile);

      expect(tiles.filter(t => t.isKnown === true).length).toBe(7);
    });
  });

  describe('sortTiles', () => {
    const tiles: Tile[] = [
      tile,
      { isKnown: true, x: -1, y: 0 },
      { isKnown: true, x: 1, y: 0 },
      { isKnown: true, x: 0, y: 1 },
      { isKnown: true, x: 0, y: -1 }
    ];

    it('should sort tiles by y first and x second', () => {
      tiles.sort((a: Tile, b: Tile) => service.sortTiles(a, b));

      expect(tiles[0]).toBe(tiles.find(t => t.x === 0 && t.y === 1));
      expect(tiles[1]).toBe(tiles.find(t => t.x === -1 && t.y === 0));
      expect(tiles[2]).toBe(tiles.find(t => t.x === 0 && t.y === 0));
      expect(tiles[3]).toBe(tiles.find(t => t.x === 1 && t.y === 0));
      expect(tiles[4]).toBe(tiles.find(t => t.x === 0 && t.y === -1));
    });
  });

  describe('generateTile', () => {
    let newTile;

    beforeEach(() => {
      service.generateMap(0);
      newTile = service.generateTile(2, 0);
    });

    it('should return a new Tile with the given coordinates', () => {
      expect(newTile.x).toBe(2);
      expect(newTile.y).toBe(0);
    });

    it('should return a Tile which is not known by default', () => {
      expect(newTile.isKnown).toBe(false);
    });

    it('should assign the matching region or create a new one', () => {
      const connectors = service.getConnecters(newTile);

      expect(newTile.region).toBeDefined();
      connectors.filter(c => c.terrain === newTile.terrain).forEach(connector => {
        expect(connector.region).toBe(newTile.region);
      });
      expect(service.regions.map(r => r.name)).toContain(newTile.region);
    });

    it('should raise the number of tiles matching the region', () => {
      const newSize = service.tiles.filter(t => t.region === newTile.region).length + 1;

      expect(service.regions.find(r => r.name === newTile.region).size).toBe(newSize);
    });
  });

  describe('randomTerrain', () => {
    beforeEach(() => {
      service.generateMap(0);
    });

    it('should return a terrain from the list', () => {
      const newTerrain = service.randomTerrain(service.regions);

      expect(terrainTypes.map(tt => tt.label)).toContain(newTerrain.label);
    });
  });

  describe('randomStartingPeople', () => {
    it('should return a random number between 500 and 1000', () => {
      const random = service.randomStartingPeople();

      expect(random).toBeGreaterThan(499);
      expect(random).toBeLessThan(1000);
    });
  });
});

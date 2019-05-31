import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, defer } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { MapComponent } from './map.component';
import { Tile } from './tiles/tile';
import { TileService } from './tiles/tile.service';

@Component({selector: 'app-tile', template: ''})
class TileStubComponent {
  @Input() tile: Tile;
  @Input() filter: string;
}

function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  const tile: Tile = {
    isKnown: true,
    x: 0,
    y: 0,
    owner: 'owner',
    people: 1234,
    region: 'plains-region',
    terrain: 'plains'
  };
  const tileServiceStub = {
    get tiles$() {
      return fakeAsyncResponse([tile]);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        TileStubComponent
      ],
      imports: [
        MatCardModule,
        MatMenuModule,
        MatIconModule
      ],
      providers: [{ provide: TileService, useValue: tileServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickTile', () => {
    it('should have no chosenTile by default', () => {
      expect(component.chosenTile).toBe(undefined);
    });

    it('should change the chosenTile', () => {
      component.clickTile(tile);

      expect(component.chosenTile).toBe(tile);
    });
  });

  describe('calculateGridColumns', () => {
    it('should return grid-template-columns as many times as there are hexagons in a row', () => {
      component.rowLength = 3;

      expect(component.calculateGridColumns()).toEqual({ 'grid-template-columns': '100px 100px 100px' });
    });

    it('should use the hexWidth as px for calculation', () => {
      component.rowLength = 3;
      component.hexWidth = 60;

      expect(component.calculateGridColumns()).toEqual({ 'grid-template-columns': '60px 60px 60px' });
    });
  });

  describe('calculateTileClasses', () => {
    it('should allways return hexagon class', () => {
      expect(component.calculateTileClasses(tile)).toMatch('hexagon');
    });

    it('should return offset class only when y coords are uneven', () => {
      const offsetTile = {
        ...tile,
        y: 1
      };

      expect(component.calculateTileClasses(tile)).not.toMatch('offset');
      expect(component.calculateTileClasses(offsetTile)).toMatch('offset');
    });

    it('should return its terrain as class only if the tile is known', () => {
      const unknownTile = {
        ...tile,
        isKnown: false
      };

      expect(component.calculateTileClasses(tile)).toMatch(tile.terrain);
      expect(component.calculateTileClasses(unknownTile)).not.toMatch(unknownTile.terrain);
    });

    it('should return focused class if tile is chosenTile', () => {
      expect(component.calculateTileClasses(tile)).not.toMatch('focused');

      component.chosenTile = tile;

      expect(component.calculateTileClasses(tile)).toMatch('focused');
    });
  });

  describe('reduceHexagonSize', () => {
    it('should reduce hexWidth by 8', () => {
      expect(component.hexWidth).toBe(100);

      component.reduceHexagonSize();

      expect(component.hexWidth).toBe(92);
    });

    it('should only reduce the hexWidth to something > 0', () => {
      component.hexWidth = 4;

      component.reduceHexagonSize();

      expect(component.hexWidth).toBe(4);
    });
  });

  describe('raiseHexagonSize', () => {
    it('should raise hexWidth by 8', () => {
      component.hexWidth = 92;

      component.raiseHexagonSize();

      expect(component.hexWidth).toBe(100);
    });

    it('should only raise the hexWidth to 100', () => {
      expect(component.hexWidth).toBe(100);

      component.raiseHexagonSize();

      expect(component.hexWidth).toBe(100);
    });
  });

  describe('updateTileFilter', () => {
    it('should have "structures" as default tileFilter', () => {
      expect(component.tileFilter).toBe('structures');
    });

    it('should update the tileFilter', () => {
      component.updateTileFilter('foo');

      expect(component.tileFilter).toBe('foo');
    });
  });
});

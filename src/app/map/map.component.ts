
import { Component, OnInit, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MapService } from './map.service';
import { Tile } from './tile';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  rowLength: number;
  hexWidth = 100;
  filters = ['terrain', 'coordinates', 'region'];
  hoverFilter = 'terrain';
  chosenTile: Tile;
  @HostBinding('attr.style')
  public get valueAsStyle(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`--hex-width: ${this.hexWidth}px`);
  }

  constructor(
    private sanitizer: DomSanitizer,
    private mapService: MapService
  ) {
    this.mapService.map$.subscribe(map => {
      this.rowLength = map.filter(tile => tile.y === 0).length;
    });
  }

  ngOnInit() { }

  clickTile(tile: Tile): void {
    if (!tile.isKnown) {
      this.mapService.revealTile(tile);
    }
    if (this.chosenTile === tile) {
      this.chosenTile = undefined;
    } else {
      this.chosenTile = tile;
    }
  }

  calculateGridColumns(): object {
    let columns = new Array<string>(this.rowLength);
    columns = columns.fill(`${this.hexWidth}px`);

    return {
      'grid-template-columns': columns.join(' ')
    };
  }

  calculateTileClasses(tile: Tile): string {
    let classes = 'hexagon';
    if (tile.y % 2 !== 0) { classes = `${classes} offset`; }
    if (tile.isKnown) { classes = `${classes} ${tile.terrain}`; }
    if (this.tileEquals(this.chosenTile, tile)) { classes = `${classes} focused`; }

    return classes;
  }

  reduceHexagonSize(): void {
    if (this.hexWidth > 0) {
      this.hexWidth = this.hexWidth - 8;
    }
  }

  raiseHexagonSize(): void {
    if (this.hexWidth < 100) {
      this.hexWidth = this.hexWidth + 8;
    }
  }

  private tileEquals(a: Tile, b: Tile): boolean {
    return a && b && a.x === b.x && a.y === b.y ? true : false;
  }

}

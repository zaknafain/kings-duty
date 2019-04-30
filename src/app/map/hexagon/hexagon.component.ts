import { Component, OnInit, Input } from '@angular/core';
import { Tile } from '../tile';

@Component({
  selector: 'app-hexagon',
  templateUrl: './hexagon.component.html',
  styleUrls: ['./hexagon.component.scss']
})
export class HexagonComponent implements OnInit {
  @Input() tile: Tile;
  @Input() hoverFilter: string;
  _chosen = false;

  constructor() { }

  ngOnInit() {
  }

  get chosen(): boolean {
    return this._chosen;
  }
  @Input()
  set chosen(val: boolean) {
    this._chosen = val;
  }

}

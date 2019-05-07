import { Tile } from '../map/tile/tile';

export class SaveGame {
  version: string;
  tiles: Tile[];
  days: number;
}

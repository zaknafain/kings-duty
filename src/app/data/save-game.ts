import { Tile } from '../map/tile/tile';
import { Realm } from '../realm/realm';

export class SaveGame {
  version: string;
  tiles: Tile[];
  days: number;
  realm: Realm;
}

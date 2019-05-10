import { Tile } from '../map/tile/tile';
import { Realm } from '../realm/realm';
import { Theme } from '../themes/theme';

export class SaveGame {
  version: string;
  tiles: Tile[];
  days: number;
  realm: Realm;
  theme: Theme;
}

import { Tile } from '../map/tiles/tile';
import { Realm } from '../realms/realm';
import { Theme } from '../themes/theme';

export class SaveGame {
  version: string;
  tiles: Tile[];
  days: number;
  realm: Realm;
  theme: Theme;
}

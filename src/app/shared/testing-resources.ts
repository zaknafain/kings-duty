import { of } from 'rxjs';

import { Tile } from '../map/tiles/tile';
import { colorThemes } from '../themes/theme';
import { Realm } from '../realms/realm';

export function fakeAsyncResponse<T>(data: T) { return of(data); }

export const tile: Tile = {
  isKnown: true,
  x: 0,
  y: 0,
  owner: 'owner',
  people: 1234,
  region: 'plains-region',
  terrain: 'plains'
};

export const tileServiceStub = {
  get tiles$() {
    return fakeAsyncResponse([tile]);
  },
};
export const tileServiceSpy = jasmine.createSpyObj('TileService', ['addPopulation']);
export const addPopulationSpy = tileServiceSpy.addPopulation;

export const timeServiceStub = {
  get days$() {
    return fakeAsyncResponse(12);
  },
  get days() {
    return 12;
  }
};

const realm: Realm = {
  name: 'Name',
  ruler: 'Ruler',
  size: 0,
  people: 1234
};

export const realmServiceStub = {
  get playerRealm$() {
    return fakeAsyncResponse(realm);
  }
};

export const themeServiceStub = {
  get theme$() {
    return fakeAsyncResponse(colorThemes[0]);
  }
};

export const eventServiceStub = {
  get currentEvent$() {
    return fakeAsyncResponse(undefined);
  }
};

export const dataServiceStub = {
  get hasData$() {
    return fakeAsyncResponse(true);
  }
};

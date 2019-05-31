import { TestBed, fakeAsync } from '@angular/core/testing';
import { defer } from 'rxjs';

import { DataService } from './data.service';
import { TileService } from '../map/tiles/tile.service';
import { Tile } from '../map/tiles/tile';
import { TimeService } from '../time/time.service';
import { Realm } from '../realms/realm';
import { RealmService } from '../realms/realm.service';
import { colorThemes } from '../themes/theme';
import { ThemeService } from '../themes/theme.service';
import { EventService } from '../events/event.service';

function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

describe('DataService', () => {
  let service: DataService;
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
  const timeServiceStub = {
    get days$() {
      return fakeAsyncResponse(12);
    }
  };
  const realm: Realm = {
    name: 'Name',
    ruler: 'Ruler',
    size: 0
  };
  const realmServiceStub = {
    get playerRealm$() {
      return fakeAsyncResponse([realm]);
    }
  };
  const themeServiceStub = {
    get theme$() {
      return fakeAsyncResponse([colorThemes[0]]);
    }
  };
  const eventServiceStub = {
    get theme$() {
      return fakeAsyncResponse([]);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TileService, useValue: tileServiceStub },
        { provide: TimeService, useValue: timeServiceStub },
        { provide: RealmService, useValue: realmServiceStub },
        { provide: ThemeService, useValue: themeServiceStub },
        { provide: EventService, useValue: eventServiceStub }
      ]
    });

    service = new DataService(
      TestBed.get(TileService),
      TestBed.get(TimeService),
      TestBed.get(RealmService),
      TestBed.get(ThemeService),
      TestBed.get(EventService)
    );

    localStorage.removeItem('saveGame');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saved', () => {
    it('should initially return saved as false', () => {
      expect(service.saved).toBeFalsy();
    });

    it('saved$ should be an Observable of saved', fakeAsync(() => {
      let saved = false;
      service.saved$.subscribe(s => { saved = s; });
      service.saved = true;

      expect(saved).toBeTruthy();
    }));
  });

  describe('hasData', () => {
    it('should initially return hasData as false', () => {
      expect(service.hasData).toBeFalsy();
    });

    it('hasData$ should be an Observable of hasData', fakeAsync(() => {
      let hasData = false;
      service.hasData$.subscribe(s => { hasData = s; });
      service.hasData = true;

      expect(hasData).toBeTruthy();
    }));
  });

  describe('save', () => {
    it('should change hasData and saved to true', () => {
      service.save();

      expect(service.hasData).toBeTruthy();
      expect(service.saved).toBeTruthy();
    });
  });

  describe('load', () => {
    it('should change saved to true', () => {
      service.save();
      service.saved = false;
      service.load();

      expect(service.saved).toBeTruthy();
    });
  });
});

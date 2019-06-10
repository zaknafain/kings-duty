import { TestBed, fakeAsync } from '@angular/core/testing';

import { DataService } from './data.service';
import { TileService } from '../map/tiles/tile.service';
import { TimeService } from '../time/time.service';
import { RealmService } from '../realms/realm.service';
import { ThemeService } from '../themes/theme.service';
import { EventService } from '../events/event.service';
import {
  tileServiceStub,
  timeServiceStub,
  realmServiceStub,
  themeServiceStub,
  eventServiceStub,
} from '../shared/testing-resources';

describe('DataService', () => {
  let service: DataService;

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

import { TestBed, fakeAsync } from '@angular/core/testing';

import { RealmService } from './realm.service';
import { Realm } from './realm';

describe('RealmService', () => {
  let service: RealmService;
  const defaultRealm: Realm = {
    ruler: 'Ruler',
    name: 'Name',
    size: 1,
    people: 1234
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ });

    service = new RealmService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially return a realm', () => {
    expect(service.playerRealm).toBeDefined();
    expect(service.playerRealm.name).toBeDefined();
    expect(service.playerRealm.ruler).toBeDefined();
    expect(service.playerRealm.size).toBe(0);
  });

  it('playerRealm$ should be an Observable of playerRealm', fakeAsync(() => {
    let playerRealm = {};
    service.playerRealm$.subscribe(r => { playerRealm = r; });
    service.playerRealm = defaultRealm;

    expect(playerRealm).toEqual(defaultRealm);
  }));
});

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Realm } from './realm';

const startingRealm: Realm = {
  name: 'Super duper kingdom',
  ruler: 'Super duper king',
  size: 0
};

@Injectable({
  providedIn: 'root'
})
export class RealmService {
  private readonly _playerRealm = new BehaviorSubject<Realm>(startingRealm);
  readonly playerRealm$ = this._playerRealm.asObservable();

  constructor() { }

  get playerRealm(): Realm {
    return this._playerRealm.getValue();
  }
  set playerRealm(playerRealm: Realm) {
    this._playerRealm.next(playerRealm);
  }

}

import { Injectable } from '@angular/core';
import { Realm } from './realm';

@Injectable({
  providedIn: 'root'
})
export class RealmService {
  playerRealm: Realm;

  constructor() {
    this.playerRealm = {
      name: 'Super duper kingdom',
      ruler: 'Super duper king',
      size: 0
    };
  }

}

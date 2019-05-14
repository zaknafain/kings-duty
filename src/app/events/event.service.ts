import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { TimeEvent, TimeEventAction, NewcommerArrivingEvent } from './time-event';
import { TileService } from '../map/tiles/tile.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly _events = new BehaviorSubject<TimeEvent[]>([]);
  readonly events$ = this._events.asObservable();

  constructor(
    private tileService: TileService
  ) { }

  get events(): TimeEvent[] {
    return this._events.getValue();
  }
  set events(events: TimeEvent[]) {
    this._events.next(events);
  }

  createInitialEvents(): void {
    const events = [
      new NewcommerArrivingEvent(),
      new NewcommerArrivingEvent(),
      new NewcommerArrivingEvent(),
      new NewcommerArrivingEvent(),
      new NewcommerArrivingEvent()
    ];

    this.events = events.sort((a, b) => a.day - b.day);
  }

  triggerEventAction(eventAction: TimeEventAction): void {
    if (eventAction && eventAction.actionType === 'gainPeople') {
      this.tileService.addPopulation(
        eventAction.actionsParams.x,
        eventAction.actionsParams.y,
        eventAction.actionsParams.people
      );
    } else if (eventAction && eventAction.actionType === 'console') {
      console.log(eventAction);
    }
  }
}

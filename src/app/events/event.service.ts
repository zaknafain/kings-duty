import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { TimeEvent, TimeEventAction, NewcommerArrivingEvent } from './time-event';
import { TileService } from '../map/tiles/tile.service';
import { TimeService } from '../time/time.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events: TimeEvent[] = [];
  private readonly _currentEvent = new BehaviorSubject<TimeEvent>(undefined);
  readonly currentEvent$ = this._currentEvent.asObservable();

  constructor(
    private tileService: TileService,
    private timeService: TimeService
  ) {
    this.timeService.days$.subscribe(day => this.setCurrentEventForDay(day));
  }

  get currentEvent(): TimeEvent {
    return this._currentEvent.getValue();
  }
  set currentEvent(currentEvent: TimeEvent) {
    this._currentEvent.next(currentEvent);
  }

  createInitialEvents(): void {
    const initialEvents = [
      new NewcommerArrivingEvent(),
      new NewcommerArrivingEvent(),
      new NewcommerArrivingEvent(),
      new NewcommerArrivingEvent(),
      new NewcommerArrivingEvent()
    ];

    this.events = initialEvents.sort((a, b) => a.day - b.day);
  }

  resolveEvent(eventAction: TimeEventAction): void {
    if (eventAction && eventAction.actionType === 'GAIN_PEOPLE') {
      this.tileService.addPopulation(
        eventAction.actionsParams.x,
        eventAction.actionsParams.y,
        eventAction.actionsParams.people
      );
    } else if (eventAction && eventAction.actionType === 'CONSOLE') {
      console.log(eventAction);
    }

    this.setCurrentEventForDay(this.timeService.days);
  }

  private setCurrentEventForDay(day: number): void {
    console.log(this.events);
    if (this.events[0] !== undefined && this.events[0].day === day) {
      this.currentEvent = this.events.shift();
    } else {
      this.currentEvent = undefined;
    }
  }
}

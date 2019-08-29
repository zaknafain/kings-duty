import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { TimeEvent, NewcommerArrivingEvent, PeopleMovedEvent, PeopleGoneEvent } from './time-event';
import { TimeEventAction } from './time-event-action';
import { TileService } from '../map/tiles/tile.service';
import { TimeService } from '../time/time.service';
import { Tile } from '../map/tiles/tile';

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

    this.events = this.sortEvents(initialEvents);
  }

  resolveEvent(eventAction: TimeEventAction): void {
    if (eventAction) {
      switch (eventAction.actionType) {
        case 'GAIN_PEOPLE':
          this.tileService.addPopulation(
            eventAction.actionsParams.x,
            eventAction.actionsParams.y,
            eventAction.actionsParams.people
          );
          break;
        case 'MOVE_PEOPLE':
          const tile: Tile = this.tileService.tiles.find(t => (
            t.x === eventAction.actionsParams.x &&
            t.y === eventAction.actionsParams.y
          ));
          const connectors: Tile[] = this.tileService.getConnecters(tile).sort((a, b) => (a.people || 0) - (b.people || 0));
          const chosenTile = connectors[0];

          this.tileService.addPopulation(chosenTile.x, chosenTile.y, eventAction.actionsParams.people);
          this.tileService.claimTile(chosenTile.x, chosenTile.y, tile.owner);
          this.tileService.removePopulation(
            eventAction.actionsParams.x,
            eventAction.actionsParams.y,
            eventAction.actionsParams.people
          );
          break;
        case 'LOOSE_PEOPLE':
          this.tileService.removePopulation(
            eventAction.actionsParams.x,
            eventAction.actionsParams.y,
            eventAction.actionsParams.people
          );
          break;
        case 'CONSOLE':
          console.log(eventAction);
      }
    }

    if (eventAction && eventAction.createEvent !== undefined) {
      this.currentEvent = this.findNewEvent(eventAction, this.timeService.days);
    } else {
      this.setCurrentEventForDay(this.timeService.days);
    }
  }

  addEvent(event: TimeEvent): void {
    const newEvents = this.events;
    newEvents.push(event);

    this.events = this.sortEvents(newEvents);
  }

  sortEvents(events: TimeEvent[]): TimeEvent[] {
    return events.sort((a, b) => a.day - b.day);
  }

  private setCurrentEventForDay(day: number): void {
    if (this.events[0] !== undefined && this.events[0].day === day) {
      this.currentEvent = this.events.shift();
    } else {
      this.currentEvent = undefined;
    }
  }

  private findNewEvent(eventAction: TimeEventAction, day: number): TimeEvent {
    switch (eventAction.createEvent) {
      case 'PEOPLE_MOVED':
        return new PeopleMovedEvent(day, eventAction.actionsParams.people);
      case 'PEOPLE_GONE':
        return new PeopleGoneEvent(day, eventAction.actionsParams.people);
    }
  }
}

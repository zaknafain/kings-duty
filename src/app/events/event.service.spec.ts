import { TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { TimeEvent, NewcommerArrivingEvent, TimeEventAction } from './time-event';
import { EventService } from './event.service';
import { TileService } from '../map/tiles/tile.service';
import { TimeService } from '../time/time.service';
import {
  tileServiceSpy,
  timeServiceStub,
  addPopulationSpy
} from '../shared/testing-resources';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TileService, useValue: tileServiceSpy },
        { provide: TimeService, useValue: timeServiceStub }
      ]
    });

    service = new EventService(
      TestBed.get(TileService),
      TestBed.get(TimeService)
    );
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  describe('currentEvent', () => {
    const event: TimeEvent = {
      day: 1,
      description: 'desc',
      title: 'title',
      eventActions: [],
      eventOptions: []
    };

    it('should initially return no event', () => {
      expect(service.currentEvent).toBeUndefined();
    });

    it('setting an event should return it', () => {
      service.currentEvent = event;

      expect(service.currentEvent).toEqual(event);
    });

    it('currentEvent$ should be an Observable of an event', fakeAsync(() => {
      let localEvent;
      service.currentEvent$.subscribe(e => { localEvent = e; });
      expect(localEvent).toBeUndefined();
      service.currentEvent = event;
      expect(localEvent).toEqual(event);
    }));
  });

  describe('createInitialEvents', () => {
    const newcommerArrivingEvent: NewcommerArrivingEvent = new NewcommerArrivingEvent();

    beforeEach(() => {
      service.createInitialEvents();
    });

    it('should set the events to a list of 5 NewcommerArrivingEvents', () => {
      expect(service.events.length).toEqual(5);
      service.events.forEach(e => { expect(e.title).toEqual(newcommerArrivingEvent.title); });
    });

    it('should sort the events by day ascending', () => {
      let day = 0;
      service.events.forEach(event => {
        expect(event.day >= day);
        day = event.day;
      });
    });
  });

  describe('triggerEventAction', () => {
    const gainPeopleAction: TimeEventAction = {
      actionType: 'gainPeople',
      actionsParams: { x: 0, y: 0, people: 100 },
      name: 'name'
    };

    it('actionType "gainPeople" calls the TileService addPopulation function', () => {
      expect(addPopulationSpy.calls.any()).toBe(false);
      service.triggerEventAction(gainPeopleAction);
      expect(addPopulationSpy.calls.any()).toBe(true);
    });
  });
});

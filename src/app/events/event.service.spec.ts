import { TestBed, fakeAsync } from '@angular/core/testing';

import { TimeEvent, NewcommerArrivingEvent, PeopleMovedEvent } from './time-event';
import { TimeEventAction } from './time-event-action';
import { EventService } from './event.service';
import { TileService } from '../map/tiles/tile.service';
import { TimeService } from '../time/time.service';
import { timeServiceStub, tileServiceStub } from '../shared/testing-resources';

describe('EventService', () => {
  let service: EventService;
  const timeEvent: TimeEvent = {
    day: 12,
    description: 'desc',
    title: 'title',
    eventActions: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TileService, useValue: tileServiceStub },
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
    it('should initially return no event', () => {
      expect(service.currentEvent).toBeUndefined();
    });

    it('setting an event should return it', () => {
      service.currentEvent = timeEvent;

      expect(service.currentEvent).toEqual(timeEvent);
    });

    it('currentEvent$ should be an Observable of an event', fakeAsync(() => {
      let localEvent;
      service.currentEvent$.subscribe(e => { localEvent = e; });
      expect(localEvent).toBeUndefined();
      service.currentEvent = timeEvent;
      expect(localEvent).toEqual(timeEvent);
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

  describe('addEvent', () => {
    const newcommerArrivingEvent: NewcommerArrivingEvent = new NewcommerArrivingEvent();

    it('should add the given event to events', () => {
      expect(service.events.length).toEqual(0);
      service.addEvent(newcommerArrivingEvent);
      expect(service.events.length).toEqual(1);
      expect(service.events[0].day).toBe(newcommerArrivingEvent.day);
    });

    it('should sort the events by day ascending', () => {
      const earlyEvent: NewcommerArrivingEvent = new NewcommerArrivingEvent();
      earlyEvent.day = newcommerArrivingEvent.day - 1;
      const laterEvent: NewcommerArrivingEvent = new NewcommerArrivingEvent();
      laterEvent.day = newcommerArrivingEvent.day + 1;

      expect(service.events.length).toEqual(0);
      service.addEvent(newcommerArrivingEvent);
      service.addEvent(earlyEvent);
      service.addEvent(laterEvent);
      expect(service.events.length).toEqual(3);
      expect(service.events[0].day).toBeLessThan(service.events[1].day);
      expect(service.events[1].day).toBeLessThan(service.events[2].day);
    });
  });

  describe('sortEvents', () => {
    const earlyEvent: NewcommerArrivingEvent = new NewcommerArrivingEvent();
    const laterEvent: NewcommerArrivingEvent = new NewcommerArrivingEvent();

    beforeEach(() => {
      earlyEvent.day = 1;
      laterEvent.day = 2;
    });

    it('should sort the events by day ascending with early event first', () => {
      const sortedEvents = service.sortEvents([ earlyEvent, laterEvent ]);

      expect(sortedEvents[0].day).toBe(1);
      expect(sortedEvents[1].day).toBe(2);
    });

    it('should sort the events by day ascending with early event last', () => {
      const sortedEvents = service.sortEvents([ laterEvent, earlyEvent ]);

      expect(sortedEvents[0].day).toBe(1);
      expect(sortedEvents[1].day).toBe(2);
    });
  });

  describe('resolveEvent', () => {
    const action: TimeEventAction = {
      actionType: 'GAIN_PEOPLE',
      actionsParams: { x: 0, y: 0, people: 100 },
      name: 'name'
    };

    it('removes the currentEvent', () => {
      service.currentEvent = timeEvent;

      service.resolveEvent(action);

      expect(service.currentEvent).toBeUndefined();
    });

    it('should assign the next event for the day', () => {
      service.events = [
        { ...timeEvent, title: 'title2' },
        { ...timeEvent, title: 'title3', day: 13 }
      ];
      service.currentEvent = timeEvent;

      service.resolveEvent(action);

      expect(service.currentEvent.title).toBe('title2');
    });

    it('actionType "GAIN_PEOPLE" calls the TileService addPopulation function', () => {
      const addPopulationSpy = spyOn(TestBed.get(TileService), 'addPopulation');
      const callCount = addPopulationSpy.calls.count();

      service.resolveEvent(action);

      expect(addPopulationSpy.calls.count()).toBe(callCount + 1);
    });

    it('actionType "MOVE_PEOPLE" calls the TileService addPopulation and removePolulation', () => {
      const addPopulationSpy = spyOn(TestBed.get(TileService), 'addPopulation');
      const claimTileSpy = spyOn(TestBed.get(TileService), 'claimTile');
      const removePopulationSpy = spyOn(TestBed.get(TileService), 'removePopulation');
      const addCount = addPopulationSpy.calls.count();
      const claimCount = claimTileSpy.calls.count();
      const removeCount = removePopulationSpy.calls.count();

      action.actionType = 'MOVE_PEOPLE';

      service.resolveEvent(action);

      expect(addPopulationSpy.calls.count()).toBe(addCount + 1);
      expect(claimTileSpy.calls.count()).toBe(claimCount + 1);
      expect(removePopulationSpy.calls.count()).toBe(removeCount + 1);
    });

    it('actionType "LOOSE_PEOPLE" calls the TileService removePolulation', () => {
      const removePopulationSpy = spyOn(TestBed.get(TileService), 'removePopulation');
      const callCount = removePopulationSpy.calls.count();

      action.actionType = 'LOOSE_PEOPLE';

      service.resolveEvent(action);

      expect(removePopulationSpy.calls.count()).toBe(callCount + 1);
    });

    it('creates a new event when the event actions says so', () => {
      action.createEvent = 'PEOPLE_MOVED';
      const movedEvent = new PeopleMovedEvent(12, action.actionsParams.people);

      service.resolveEvent(action);

      expect(service.currentEvent.title).toBe(movedEvent.title);
    });
  });
});

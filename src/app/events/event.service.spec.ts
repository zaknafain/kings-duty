import { TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { TimeEvent, NewcommerArrivingEvent, TimeEventAction } from './time-event';
import { EventService } from './event.service';
import { TileService } from '../map/tiles/tile.service';

describe('EventService', () => {
  let service: EventService;
  const tileServiceStub = jasmine.createSpyObj('TileService', ['addPopulation']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TileService, useValue: tileServiceStub }]
    });

    service = new EventService(TestBed.get(TileService));
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  describe('events', () => {
    const event: TimeEvent = {
      day: 1,
      description: 'desc',
      title: 'title',
      eventActions: [],
      eventOptions: []
    };

    it('should initially return no events', () => {
      expect(service.events).toEqual([]);
    });

    it('setting events should return them', () => {
      service.events = [event];

      expect(service.events).toEqual([event]);
    });

    it('events$ should be an Observable of events', fakeAsync(() => {
      let events = [];
      service.events$.subscribe(e => { events = e; });
      expect(events).toEqual([]);
      service.events = [event];
      expect(events).toEqual([event]);
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
    const addPopulationSpy = tileServiceStub.addPopulation.and.returnValue( of(undefined) );

    it('actionType "gainPeople" calls the TileService addPopulation function', () => {
      expect(addPopulationSpy.calls.any()).toBe(false);
      service.triggerEventAction(gainPeopleAction);
      expect(addPopulationSpy.calls.any()).toBe(true);
    });
  });
});

import {
  TimeEvent,
  NewcommerArrivingEvent,
  PeopleFeelCrowdedEvent,
  PeopleMovedEvent,
  PeopleGoneEvent
} from './time-event';

class TimeEventDummy implements TimeEvent {
  day: 12;
  description: 'desc';
  eventActions: [];
  title: 'title';
}

describe('TimeEvent', () => {
  it('is an interface', () => {
    expect(new TimeEventDummy()).toBeTruthy();
  });
});

describe('NewcommerArrivingEvent', () => {
  const event = new NewcommerArrivingEvent();

  it('implements TimeEvent', () => {
    expect(event.day).toBeDefined();
    expect(event.description).toBeDefined();
    expect(event.title).toBeDefined();
    expect(event.eventActions).toBeDefined();
  });

  it('should have one TimeEventAction', () => {
    expect(event.eventActions.length).toBe(1);
  });

  it('should include a TimeEventActions with type "GAIN_PEOPLE"', () => {
    expect(event.eventActions.filter(a => a.actionType === 'GAIN_PEOPLE').length).toBe(1);
  });
});

describe('PeopleFeelCrowdedEvent', () => {
  const event = new PeopleFeelCrowdedEvent(12, 1, 2);

  it('implements TimeEvent', () => {
    expect(event.day).toBeDefined();
    expect(event.description).toBeDefined();
    expect(event.title).toBeDefined();
    expect(event.eventActions).toBeDefined();
  });

  it('should have 2 TimeEventActions', () => {
    expect(event.eventActions.length).toBe(2);
  });

  it('should include a TimeEventActions with type "MOVE_PEOPLE"', () => {
    expect(event.eventActions.filter(a => a.actionType === 'MOVE_PEOPLE').length).toBe(1);
  });

  it('should include a TimeEventActions with type "LOOSE_PEOPLE"', () => {
    expect(event.eventActions.filter(a => a.actionType === 'LOOSE_PEOPLE').length).toBe(1);
  });
});

describe('PeopleMovedEvent', () => {
  const event = new PeopleMovedEvent(12, 5);

  it('implements TimeEvent', () => {
    expect(event.day).toBeDefined();
    expect(event.description).toBeDefined();
    expect(event.title).toBeDefined();
    expect(event.eventActions).toBeDefined();
  });

  it('should have 0 TimeEventActions', () => {
    expect(event.eventActions.length).toBe(0);
  });

  it('description contains the given number of people', () => {
    expect(event.description).toMatch('5');
  });
});

describe('PeopleGoneEvent', () => {
  const event = new PeopleGoneEvent(12, 5);

  it('implements TimeEvent', () => {
    expect(event.day).toBeDefined();
    expect(event.description).toBeDefined();
    expect(event.title).toBeDefined();
    expect(event.eventActions).toBeDefined();
  });

  it('should have 0 TimeEventActions', () => {
    expect(event.eventActions.length).toBe(0);
  });

  it('description contains the given number of people', () => {
    expect(event.description).toMatch('5');
  });
});

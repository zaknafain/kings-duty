import { TimeEvent, TimeEventAction, NewcommerArrivingEvent } from './time-event';

class TimeEventDummy implements TimeEvent {
  day: 12;
  description: 'desc';
  eventActions: [];
  eventOptions: {};
  title: 'title';
}

class TimeEventActionDummy implements TimeEventAction {
  actionType: 'type';
  actionsParams: {};
  name: 'name';
}

describe('TimeEvent', () => {
  it('is an interface', () => {
    expect(new TimeEventDummy()).toBeTruthy();
  });
});

describe('TimeEventAction', () => {
  it('is an interface', () => {
    expect(new TimeEventActionDummy()).toBeTruthy();
  });
});

describe('NewcommerArrivingEvent', () => {
  const event = new NewcommerArrivingEvent();

  it('implements TimeEvent', () => {
    expect(event.day).toBeDefined();
    expect(event.description).toBeDefined();
    expect(event.title).toBeDefined();
    expect(event.eventActions).toBeDefined();
    expect(event.eventOptions).toBeDefined();
  });

  it('should have 2 TimeEventActions', () => {
    expect(event.eventActions.length).toBe(1);
  });

  it('should include a TimeEventActions with type "gainPeople"', () => {
    expect(event.eventActions.filter(a => a.actionType === 'GAIN_PEOPLE').length).toBe(1);
  });
});

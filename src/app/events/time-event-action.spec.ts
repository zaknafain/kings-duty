import {
  TimeEventAction,
  GainPeopleAction,
  MovePeopleAction,
  LoosePeopleAction
} from './time-event-action';

class TimeEventActionDummy implements TimeEventAction {
  actionType: 'type';
  actionsParams: {};
  name: 'name';
}

describe('TimeEventAction', () => {
  it('is an interface', () => {
    expect(new TimeEventActionDummy()).toBeTruthy();
  });
});

describe('GainPeopleAction', () => {
  const action = new GainPeopleAction({ people: 1234, x: 1, y: 2 });

  it('implements TimeEventAction', () => {
    expect(action.name).toBeDefined();
    expect(action.actionType).toBeDefined();
    expect(action.actionsParams).toBeDefined();
  });

  it('should have the given action params', () => {
    expect(action.actionsParams.people).toBe(1234);
    expect(action.actionsParams.x).toBe(1);
    expect(action.actionsParams.y).toBe(2);
  });
});

describe('MovePeopleAction', () => {
  const action = new MovePeopleAction({ people: 1234, x: 1, y: 2 });

  it('implements TimeEventAction', () => {
    expect(action.name).toBeDefined();
    expect(action.actionType).toBeDefined();
    expect(action.actionsParams).toBeDefined();
  });

  it('should have the given action params', () => {
    expect(action.actionsParams.people).toBe(1234);
    expect(action.actionsParams.x).toBe(1);
    expect(action.actionsParams.y).toBe(2);
  });
});

describe('LoosePeopleAction', () => {
  const action = new LoosePeopleAction({ people: 1234, x: 1, y: 2 });

  it('implements TimeEventAction', () => {
    expect(action.name).toBeDefined();
    expect(action.actionType).toBeDefined();
    expect(action.actionsParams).toBeDefined();
  });

  it('should have the given action params', () => {
    expect(action.actionsParams.people).toBe(1234);
    expect(action.actionsParams.x).toBe(1);
    expect(action.actionsParams.y).toBe(2);
  });
});

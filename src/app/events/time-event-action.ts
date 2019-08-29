export interface TimeEventAction {
  name: string;
  actionType: string;
  actionsParams: any;
  createEvent?: string;
}

export class GainPeopleAction implements TimeEventAction {
  actionType = 'GAIN_PEOPLE';
  name = 'Welcome them';
  actionsParams = { people: 0, x: 0, y: 0 };

  constructor(params: object) {
    this.actionsParams = { ...this.actionsParams, ...params };
  }
}

export class MovePeopleAction implements TimeEventAction {
  actionType = 'MOVE_PEOPLE';
  name = 'Let them go';
  actionsParams = { people: 0, x: 0, y: 0 };
  createEvent = 'PEOPLE_MOVED';

  constructor(params: object) {
    this.actionsParams = { ...this.actionsParams, ...params };
  }
}

export class LoosePeopleAction implements TimeEventAction {
  actionType = 'LOOSE_PEOPLE';
  name = 'Force them to stay';
  actionsParams = { people: 0, x: 0, y: 0 };
  createEvent: 'PEOPLE_GONE';

  constructor(params: object) {
    this.actionsParams = { ...this.actionsParams, ...params };
  }
}

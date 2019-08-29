import {
  TimeEventAction,
  GainPeopleAction,
  MovePeopleAction,
  LoosePeopleAction
} from './time-event-action';

export interface TimeEvent {
  title: string;
  description: string;
  day: number;
  eventActions: TimeEventAction[];
}

export class NewcommerArrivingEvent implements TimeEvent {
  title = 'Newcommers are arriving';
  description = '';
  day = 0;
  eventActions = [];

  constructor() {
    const people = (Math.random() * 90) + 10;

    this.day = Math.floor(Math.random() * 100);
    this.eventActions.push(new GainPeopleAction({ people, x: 0, y: 0 }));
    this.description = `There are some newcommers arriving at your village.
      They have survived the wilderness for so long and swear to you if let them in.
      There are ${Math.floor(people)} people waiting for you to let them in.`;
  }
}

export class PeopleFeelCrowdedEvent implements TimeEvent {
  title = 'The people feel crowded';
  description = '';
  day = 0;
  eventActions = [];

  constructor(dayNow: number, x: number, y: number) {
    const people = (Math.random() * 50) + 20;

    this.day = dayNow;
    this.eventActions.push(new MovePeopleAction({ people, x, y }));
    this.eventActions.push(new LoosePeopleAction({ people: people / 5, x, y }));
    this.description = `Some of your people don't feel comfortable anymore.
      They wish to leave their homes and found a new one nearby.
      If you allow them to leave the will found a new settlement for your realm.
      Should you force them to stay, some of them will possibly leave your realm forever.`;
  }
}

export class PeopleMovedEvent implements TimeEvent {
  title = 'People moved to a different location';
  description = '';
  day = 0;
  eventActions = [];

  constructor(dayNow: number, people: number) {
    this.day = dayNow;
    this.description = `${Math.floor(people)} people left their homes and moved to a different location.`;
  }
}

export class PeopleGoneEvent implements TimeEvent {
  title = 'People left your realm';
  description = '';
  day = 0;
  eventActions = [];

  constructor(dayNow: number, people: number) {
    this.day = dayNow;
    this.description = `${Math.floor(people)} people were unhappy with your rule and left your society.`;
  }
}

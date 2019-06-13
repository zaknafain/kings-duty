export interface TimeEventAction {
  name: string;
  actionType: string;
  actionsParams: any;
}

export interface TimeEvent {
  title: string;
  description: string;
  day: number;
  eventOptions: any;
  eventActions: TimeEventAction[];
}

export class NewcommerArrivingEvent implements TimeEvent {
  title = 'Newcommers are arriving';
  day = 0;
  eventOptions = { people: 0 };
  eventActions = [
    {
      name: 'Welcome them',
      actionType: 'GAIN_PEOPLE',
      actionsParams: { people: 0, x: 0, y: 0 }
    }
  ];
  description = '';

  constructor() {
    const people = (Math.random() * 90) + 10;

    this.day = Math.floor(Math.random() * 100);
    this.eventOptions.people = people;
    this.eventActions.find(a => a.actionType === 'GAIN_PEOPLE').actionsParams.people = people;
    this.description = `There are some newcommers arriving at your village.
      They have survived the wilderness for so long and swear to you if let them in.
      There are ${Math.floor(people)} people waiting for you to let them in.`;
  }

}

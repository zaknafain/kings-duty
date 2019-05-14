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
      actionType: 'gainPeople',
      actionsParams: { people: 0, x: 0, y: 0 }
    },
    {
      name: 'Deny them',
      actionType: 'console',
      actionsParams: { }
    }
  ];
  description = '';

  constructor() {
    const people = Math.floor(Math.random() * 100);

    this.day = Math.floor(Math.random() * 100);
    this.eventOptions.people = people;
    this.eventActions.forEach(a => a.actionsParams.people = people);
    this.description = `There are some newcommers arriving at your village.
      They have survived for so long and swear to you if let them in.
      There are ${people} people waiting for your decision.`;
  }

}

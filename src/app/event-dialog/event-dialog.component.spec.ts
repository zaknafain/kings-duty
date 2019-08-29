import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { EventDialogComponent } from './event-dialog.component';
import { TimeEvent } from '../events/time-event';

describe('EventDialogComponent', () => {
  let component: EventDialogComponent;
  let fixture: ComponentFixture<EventDialogComponent>;
  let MAT_DIALOG_DATA_STUB: Partial<TimeEvent>;
  const matDialogRefStub: Partial<EventDialogComponent> = {};

  beforeEach(async(() => {
    MAT_DIALOG_DATA_STUB = {
      title: 'Title',
      day: 1,
      description: 'Desc',
      eventActions: [
        { name: 'Action 1', actionType: 'action', actionsParams: {} },
        { name: 'Action 2', actionType: 'action', actionsParams: {} },
        { name: 'Action 3', actionType: 'action', actionsParams: {} },
        { name: 'Action 4', actionType: 'action', actionsParams: {} }
      ]
    };

    TestBed.configureTestingModule({
      declarations: [ EventDialogComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: MAT_DIALOG_DATA_STUB },
        { provide: MatDialogRef, useValue: matDialogRefStub }
      ],
      imports: [ MatDialogModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a headline with the data title', () => {
    const dialogElement: HTMLElement = fixture.nativeElement;
    const h1 = dialogElement.querySelector('h1');

    expect(h1.textContent).toContain(MAT_DIALOG_DATA_STUB.title);
  });

  it('should display the description text of the data', () => {
    const dialogElement: HTMLElement = fixture.nativeElement;

    expect(dialogElement.textContent).toContain(MAT_DIALOG_DATA_STUB.description);
  });

  it('should display buttons for all actions in the dialog footer', () => {
    const dialogElement: HTMLElement = fixture.nativeElement;
    const footer = dialogElement.querySelector('div[mat-dialog-actions]');

    MAT_DIALOG_DATA_STUB.eventActions.forEach(action => {
      expect(footer.textContent).toContain(action.name);
    });
  });
});

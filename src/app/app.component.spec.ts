import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, Pipe, PipeTransform, NgModule } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { TileService } from './map/tiles/tile.service';
import { TimeService } from './time/time.service';
import { RealmService } from './realms/realm.service';
import { ThemeService } from './themes/theme.service';
import { EventService } from './events/event.service';
import { DataService } from './save-games/data.service';
import {
  tileServiceStub,
  timeServiceStub,
  realmServiceStub,
  themeServiceStub,
  eventServiceStub,
  dataServiceStub
} from './shared/testing-resources';
import { NewGameDialogComponent } from './new-game-dialog/new-game-dialog.component';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({ selector: 'app-map', template: '' })
class MapStubComponent {}

@Pipe({ name: 'gameTime' })
class GameTimeStubPipe implements PipeTransform { transform(text: string) { return text; } }

@NgModule({
  imports: [
    FormsModule,
    MatDialogModule,
    NoopAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule,
  ],
  declarations: [
    NewGameDialogComponent,
    EventDialogComponent
  ],
  entryComponents: [
    NewGameDialogComponent,
    EventDialogComponent
  ],
})
class DialogTestModule { }

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MapStubComponent,
        GameTimeStubPipe
      ],
      imports: [
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatDialogModule,
        DialogTestModule
      ],
      providers: [
        { provide: TileService, useValue: tileServiceStub },
        { provide: TimeService, useValue: timeServiceStub },
        { provide: RealmService, useValue: realmServiceStub },
        { provide: ThemeService, useValue: themeServiceStub },
        { provide: EventService, useValue: eventServiceStub },
        { provide: DataService, useValue: dataServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});

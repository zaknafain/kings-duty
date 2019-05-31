import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { NewGameDialogComponent } from './new-game-dialog.component';
import { NewGameForm } from './new-game-form';
import { colorThemes, Theme } from '../themes/theme';
import { ThemeService } from '../themes/theme.service';

class ThemeServiceStub {
  currentTheme: Theme;

  get theme() {
    return this.currentTheme;
  }
  set theme(theme: Theme) {
    this.currentTheme = theme;
  }
}

describe('NewGameDialogComponent', () => {
  let component: NewGameDialogComponent;
  let fixture: ComponentFixture<NewGameDialogComponent>;
  const themeServiceStub = new ThemeServiceStub();
  let MAT_DIALOG_DATA_STUB: Partial<NewGameForm>;
  const matDialogRefStub: Partial<NewGameDialogComponent> = {};

  beforeEach(async(() => {
    MAT_DIALOG_DATA_STUB = {
      colorTheme: colorThemes[0],
      realmName: 'Super Realm',
      rulerName: 'Super Ruler',
      visibleRadius: 1
    };

    TestBed.configureTestingModule({
      declarations: [ NewGameDialogComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: MAT_DIALOG_DATA_STUB },
        { provide: ThemeService, useValue: themeServiceStub },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: HAMMER_LOADER, useValue: () => new Promise(() => {}) }
      ],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatSliderModule,
        MatInputModule,
        MatIconModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    themeServiceStub.currentTheme = colorThemes[0];
    fixture = TestBed.createComponent(NewGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkTheme', () => {
    it('should update the theme for the data form', () => {
      expect(component.data.colorTheme).toEqual(colorThemes[0]);

      component.checkTheme(colorThemes[1]);

      expect(component.data.colorTheme).toEqual(colorThemes[1]);
    });

    it('should update the theme of the ThemeService', () => {
      expect(themeServiceStub.theme).toEqual(colorThemes[0]);

      component.checkTheme(colorThemes[1]);

      expect(themeServiceStub.theme).toEqual(colorThemes[1]);
    });
  });
});

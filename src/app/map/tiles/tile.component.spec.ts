import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileComponent } from './tile.component';
import { Tile } from './tile';

describe('TileComponent', () => {
  let component: TileComponent;
  let fixture: ComponentFixture<TileComponent>;
  const tileStub: Tile = {
    isKnown: true,
    x: 42,
    y: 69,
    terrain: 'plains',
    owner: 'owner',
    people: 1234,
    region: 'plains-region'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileComponent);
    component = fixture.componentInstance;
    component.tile = tileStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a svg when the tile is not known', () => {
    const tileStub2 = { ...tileStub, isKnown: false };
    component.tile = tileStub2;
    component.filter = 'coordinates';
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.textContent).not.toEqual('42 | 69');
    expect(compiled.querySelector('svg').textContent).toBeDefined();
  });

  it('should not show any text by default', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.textContent).not.toEqual('42 | 69');
    expect(compiled.textContent).not.toEqual('1,234');
    expect(compiled.textContent).not.toEqual('Plains');
    expect(compiled.textContent).not.toEqual(tileStub.region);
    expect(compiled.textContent).not.toEqual(tileStub.owner);
  });

  describe('filter', () => {
    it('should show the coordinates with filter === "coordinates"', () => {
      component.filter = 'coordinates';
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.textContent).toEqual('42 | 69');
      expect(compiled.textContent).not.toEqual('1,234');
      expect(compiled.textContent).not.toEqual('Plains');
      expect(compiled.textContent).not.toEqual(tileStub.region);
      expect(compiled.textContent).not.toEqual(tileStub.owner);
    });

    it('should show the population with filter === "people"', () => {
      component.filter = 'people';
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.textContent).not.toEqual('42 | 69');
      expect(compiled.textContent).toEqual('1,234');
      expect(compiled.textContent).not.toEqual('Plains');
      expect(compiled.textContent).not.toEqual(tileStub.region);
      expect(compiled.textContent).not.toEqual(tileStub.owner);
    });

    it('should show the terrain with filter === "terrain"', () => {
      component.filter = 'terrain';
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.textContent).not.toEqual('42 | 69');
      expect(compiled.textContent).not.toEqual('1,234');
      expect(compiled.textContent).toEqual('Plains');
      expect(compiled.textContent).not.toEqual(tileStub.region);
      expect(compiled.textContent).not.toEqual(tileStub.owner);
    });

    it('should show the region with filter === "region"', () => {
      component.filter = 'region';
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.textContent).not.toEqual('42 | 69');
      expect(compiled.textContent).not.toEqual('1,234');
      expect(compiled.textContent).not.toEqual('Plains');
      expect(compiled.textContent).toEqual(tileStub.region);
      expect(compiled.textContent).not.toEqual(tileStub.owner);
    });
  });
});

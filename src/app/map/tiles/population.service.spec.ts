import { TestBed } from '@angular/core/testing';

import { Tile } from './tile';
import { PopulationService } from './population.service';
import { TileService } from './tile.service';
import { TimeService } from 'src/app/time/time.service';
import {
  tileServiceStub,
  timeServiceSpy,
} from '../../shared/testing-resources';

describe('PopulationService', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TileService, useValue: tileServiceStub },
        { provide: TimeService, useValue: timeServiceSpy },
    ]});

    service = TestBed.get(PopulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateGrowth', () => {
    it('should return 0.3% of the given number', () => {
      expect(service.calculateGrowth(9000)).toBe(27);
    });

    it('should not round the value', () => {
      expect(service.calculateGrowth(300)).toBe(0.9);
    });
  });

  describe('calculatePopulationGrowth', () => {
    const tile: Tile = {
      isKnown: true,
      people: 12000,
      x: 0,
      y: 0
    };

    it('should return the growth divided by the part of the year', () => {
      expect(service.calculatePopulationGrowth(tile)).toBeCloseTo(1, -2);
    });
  });
});

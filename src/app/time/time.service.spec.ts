import { TestBed, fakeAsync } from '@angular/core/testing';

import { TimeService } from './time.service';

describe('TimeService', () => {
  let service: TimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });

    service = new TimeService();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  describe('timeRunning', () => {
    it('should initially return "stop"', () => {
      expect(service.timeRunning).toBe('stop');
    });

    it('setting the timeRunning should return it', () => {
      service.timeRunning = 'start';

      expect(service.timeRunning).toBe('start');
    });

    it('timeRunning$ should be an Observable of timeRunning', fakeAsync(() => {
      let timeRunning;
      service.timeRunning$.subscribe(tr => { timeRunning = tr; });
      expect(timeRunning).toBe('stop');
      service.timeRunning = 'start';
      expect(timeRunning).toBe('start');
    }));
  });

  describe('days', () => {
    it('should initially return 1', () => {
      expect(service.days).toBe(1);
    });

    it('setting the days should return it', () => {
      service.days = 42;

      expect(service.days).toBe(42);
    });

    it('days$ should be an Observable of days', fakeAsync(() => {
      let days;
      service.days$.subscribe(d => { days = d; });
      expect(days).toBe(1);
      service.days = 42;
      expect(days).toBe(42);
    }));
  });

  describe('startSlowTime', () => {
    it('should set timeRunning to "normal"', () => {
      expect(service.timeRunning).toBe('stop');

      service.startSlowTime();

      expect(service.timeRunning).toBe('normal');
    });

    it('should increment days by one in one second', () => {
      expect(service.days).toBe(1);

      service.startSlowTime();
      jasmine.clock().tick(999);

      expect(service.days).toBe(1);

      jasmine.clock().tick(2);

      expect(service.days).toBe(2);
    });
  });

  describe('startFastTime', () => {
    it('should set timeRunning to "fast"', () => {
      expect(service.timeRunning).toBe('stop');

      service.startFastTime();

      expect(service.timeRunning).toBe('fast');
    });

    it('should increment days by one in a fifth second', () => {
      expect(service.days).toBe(1);

      service.startFastTime();
      jasmine.clock().tick(199);

      expect(service.days).toBe(1);

      jasmine.clock().tick(2);

      expect(service.days).toBe(2);
    });
  });

  describe('switching time speed', () => {
    it('should reset the interval when switching from normal to fast', () => {
      expect(service.days).toBe(1);

      service.startSlowTime();
      jasmine.clock().tick(999);

      expect(service.days).toBe(1);

      service.startFastTime();
      jasmine.clock().tick(2);

      expect(service.days).toBe(1);

      jasmine.clock().tick(199);
      expect(service.days).toBe(2);
    });

    it('should reset the interval when switching from fast to normal', () => {
      expect(service.days).toBe(1);

      service.startFastTime();
      jasmine.clock().tick(199);

      expect(service.days).toBe(1);

      service.startSlowTime();
      jasmine.clock().tick(2);

      expect(service.days).toBe(1);

      jasmine.clock().tick(999);
      expect(service.days).toBe(2);
    });

    it('should not have two intervals running after switching speed', () => {
      expect(service.days).toBe(1);

      service.startFastTime();
      jasmine.clock().tick(199);

      expect(service.days).toBe(1);

      service.startSlowTime();
      jasmine.clock().tick(1001);

      expect(service.days).toBe(2);

      service.startFastTime();
      jasmine.clock().tick(1001);

      expect(service.days).toBe(7);
    });
  });

  describe('stopTime', () => {
    it('should set timeRunning to "stop"', () => {
      service.startSlowTime();

      expect(service.timeRunning).toBe('normal');

      service.stopTime();

      expect(service.timeRunning).toBe('stop');
    });

    it('should stop intervals and not increment days anymore', () => {
      expect(service.days).toBe(1);

      service.startFastTime();
      jasmine.clock().tick(1001);

      expect(service.days).toBe(6);

      service.stopTime();
      jasmine.clock().tick(1001);

      expect(service.days).toBe(6);
    });
  });

  describe('resetTime', () => {
    it('should set timeRunning to "stop"', () => {
      service.startSlowTime();

      expect(service.timeRunning).toBe('normal');

      service.resetTime();

      expect(service.timeRunning).toBe('stop');
    });

    it('should set days back to 1', () => {
      service.startSlowTime();
      jasmine.clock().tick(1001);

      expect(service.days).toBe(2);

      service.resetTime();

      expect(service.days).toBe(1);
    });

    it('should stop intervals and not increment days anymore', () => {
      expect(service.days).toBe(1);

      service.startFastTime();
      jasmine.clock().tick(1001);

      expect(service.days).toBe(6);

      service.resetTime();
      jasmine.clock().tick(1001);

      expect(service.days).toBe(1);
    });
  });
});

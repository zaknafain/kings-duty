import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private readonly _timeRunning = new BehaviorSubject<string>('stop');
  readonly timeRunning$ = this._timeRunning.asObservable();
  private readonly _days = new BehaviorSubject<number>(1);
  readonly days$ = this._days.asObservable();
  private intervalId;

  constructor() { }

  get days(): number {
    return this._days.getValue();
  }
  set days(days: number) {
    this._days.next(days);
  }

  get timeRunning(): string {
    return this._timeRunning.getValue();
  }
  set timeRunning(running: string) {
    this._timeRunning.next(running);
  }

  startSlowTime(): void {
    clearInterval(this.intervalId);
    this.startTime(1000);
    this.timeRunning = 'normal';
  }

  startFastTime(): void {
    clearInterval(this.intervalId);
    this.startTime(200);
    this.timeRunning = 'fast';
  }

  stopTime(): void {
    clearInterval(this.intervalId);
    this.timeRunning = 'stop';
  }

  resetTime(): void {
    this.stopTime();
    this.days = 1;
  }

  private startTime(interval: number) {
    this.intervalId = setInterval(this.incrementDays.bind(this), interval);
  }

  private incrementDays() {
    this.days = this.days + 1;
  }

}

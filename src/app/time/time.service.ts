import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private readonly _timeRunning = new BehaviorSubject<boolean>(false);
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

  get timeRunning(): boolean {
    return this._timeRunning.getValue();
  }
  set timeRunning(running: boolean) {
    this._timeRunning.next(running);
  }

  startTime(): void {
    this.intervalId = setInterval(this.incrementDays.bind(this), 1000);
    this.timeRunning = true;
  }

  stopTime(): void {
    clearInterval(this.intervalId);
    this.timeRunning = false;
  }

  resetTime(): void {
    this.stopTime();
    this.days = 1;
  }

  private incrementDays() {
    this.days = this.days + 1;
  }

}

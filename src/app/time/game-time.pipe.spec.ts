import { GameTimePipe } from './game-time.pipe';

describe('GameTimePipe', () => {
  it('create an instance', () => {
    const pipe = new GameTimePipe();
    expect(pipe).toBeTruthy();
  });
});

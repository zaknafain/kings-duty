import { GameTimePipe } from './game-time.pipe';

describe('GameTimePipe', () => {
  const pipe = new GameTimePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('days', () => {
    it('should return correct ending of days', () => {
      expect(pipe.transform(1)).toMatch('1st');
      expect(pipe.transform(2)).toMatch('2nd');
      expect(pipe.transform(3)).toMatch('3rd');
      expect(pipe.transform(4)).toMatch('4th');
    });

    it('should return 1st again when 91 days are over', () => {
      expect(pipe.transform(92)).toMatch('1st');
    });
  });

  describe('seasons', () => {
    it('should return Spring from day 1 to day 90', () => {
      expect(pipe.transform(1)).toMatch('Spring');
      expect(pipe.transform(90)).toMatch('Spring');
    });

    it('should return Summer from day 92 to day 181', () => {
      expect(pipe.transform(92)).toMatch('Summer');
      expect(pipe.transform(181)).toMatch('Summer');
    });

    it('should return Autumn from day 183 to day 272', () => {
      expect(pipe.transform(183)).toMatch('Autumn');
      expect(pipe.transform(272)).toMatch('Autumn');
    });

    it('should return Winter from day 274 to day 363', () => {
      expect(pipe.transform(274)).toMatch('Winter');
      expect(pipe.transform(363)).toMatch('Winter');
    });

    it('should return Spring again when 364 days are over', () => {
      expect(pipe.transform(365)).toMatch('Spring');
    });
  });

  describe('years', () => {
    it('should return year 0 for day 1 to day 364', () => {
      expect(pipe.transform(1)).toMatch('year 0');
      expect(pipe.transform(364)).toMatch('year 0');
    });

    it('should return year 1 when 364 days are over', () => {
      expect(pipe.transform(365)).toMatch('year 1');
    });
  });

  describe('special days', () => {
    it('returns Spring Equinox on day 91', () => {
      expect(pipe.transform(91)).toMatch('Spring Equinox');
    });

    it('returns Summers End on day 182', () => {
      expect(pipe.transform(182)).toMatch('Summers End');
    });

    it('returns Autumn Equinox on day 273', () => {
      expect(pipe.transform(273)).toMatch('Autumn Equinox');
    });

    it('returns Winters End on day 364', () => {
      expect(pipe.transform(364)).toMatch('Winters End');
    });
  });
});

import { Pipe, PipeTransform } from '@angular/core';

const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
const specialDays = ['Spring Equinox', 'Summers End', 'Autumn Equinox', 'Winters End'];

@Pipe({
  name: 'gameTime'
})
export class GameTimePipe implements PipeTransform {

  transform(value: number): string {
    const calcVal = value - 0.1;
    const year = Math.floor(calcVal / 364);
    const season = Math.floor((calcVal - (year * 364)) / 91);
    const days = value - (year * 364) - (season * 91);

    if (days === 91) {
      return `${specialDays[season]} of year ${year}`;
    } else {
      const dayAddition = this.additionToDays(days);

      return `${days}${dayAddition} of ${seasons[season]} of year ${year}`;
    }
  }

  private additionToDays(days: number): string {
    if (days === 1) { return 'st'; }
    if (days === 2) { return 'nd'; }
    if (days === 3) { return 'rd'; }

    return 'th';
  }

}

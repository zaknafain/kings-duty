import { Component } from '@angular/core';
import { MapService } from './map/map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kings-duty';
  visibleRadius = 3;

  constructor(private mapService: MapService) { }

  renewMap(): void {
    this.mapService.generateMap(this.visibleRadius);
  }
}

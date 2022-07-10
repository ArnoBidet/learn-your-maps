import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { HeaderDisplayService } from 'src/app/shared/services/header-display.service';
import { MapData } from 'src/app/shared/interfaces/MapData.interface';
import { MapGroupService } from 'src/app/shared/services/map-group/map-group.service';
import { Map } from 'src/app/shared/interfaces/Map.interface';
import { MapService } from 'src/app/shared/services/map/map.service';

@Component({
  selector: 'app-against-the-clock',
  templateUrl: './against-the-clock.component.html',
  styleUrls: ['./against-the-clock.component.scss']
})
export class AgainstTheClockComponent implements OnInit {

  areaSelected: MapData | undefined = undefined;
  currentMap: Map | undefined;

  foundNumber = 20;

  constructor(public dialog: MatDialog,
    private mapGroupService: MapGroupService,
    private mapService: MapService,
    private headerDisplayService: HeaderDisplayService,
    private route: ActivatedRoute,
    private router: Router) { }


  ngOnInit(): void {
    setTimeout(() => this.headerDisplayService.setPosition("relative"));

    this.route.queryParams.subscribe(queryParameter => {
      if (!queryParameter) return; // If there is no value then skip
      this.mapService.getMap(queryParameter["mapIdentifier"]).then((map: Map | undefined) => this.currentMap = map);
    })
  }
  ngOnDestroy(): void {
    this.headerDisplayService.setPosition("sticky");
  }

  /**
   * When an area is selected, get its data an display informations
   * @param areaCommons An area data
   */
  onAreaSelected(areaCommons: MapData) {
    this.areaSelected = areaCommons;
  }
}

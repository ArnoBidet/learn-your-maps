import { Component, Input, OnInit } from '@angular/core';
import { InputSubjectService } from 'src/app/shared/services/game-mode-specific/input-subject.service';
import { DataSubjectService } from 'src/app/shared/services/map-specific/data-subject.service';
import { NodeSubjectService } from 'src/app/shared/services/map-specific/node-subject.service';
import { MapToolbox } from '../map-toolbox';
import { Area } from 'src/app/shared/utils/interfaces/map-oriented/area';
@Component({
  selector: 'app-map-prefectures-japon',
  templateUrl: './map-prefectures-japon.component.html',
  styleUrls: ['./map-prefectures-japon.component.scss']
})
export class MapPrefecturesJaponComponent extends MapToolbox  implements OnInit {
  
  /**
	 * If node selection should be allowed or not
	 */
	 @Input() public  clickArea : boolean = false;

	 @Input() public data : Area[] = [];

  constructor(inputSubjectService :InputSubjectService, nodeSubjectService : NodeSubjectService, dataSubjectService : DataSubjectService){
    super(inputSubjectService, nodeSubjectService, dataSubjectService); 
  }
  ngOnInit(): void {
		super.ngOnInit();
		if(this.clickArea)
      this.generateOnClickEvent();
  }

  ngOnDestroy(){
		Object.keys(this.subscriptions).forEach((key : string) => {
			this.subscriptions[key].unsubscribe();
		});
	}
}

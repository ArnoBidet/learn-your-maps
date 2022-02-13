import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameStatus } from 'src/app/shared/utils/enums/GameStatus.enum';
import { GameModeMetaData } from 'src/app/shared/utils/interfaces/game-oriented/game-mode-meta-data.interface';
import { Area } from 'src/app/shared/utils/interfaces/map-oriented/area';
import { MapMetaData } from 'src/app/shared/utils/interfaces/map-oriented/map-meta-data.interface';
import { GameModeType } from 'src/app/shared/utils/types/game-mode.type';
import { MapsType } from 'src/app/shared/utils/types/maps.type';

@Component({
  selector: 'app-input-against-time',
  templateUrl: './input-against-time.component.html',
  styleUrls: ['./input-against-time.component.scss']
})
export class InputAgainstTimeComponent implements OnInit {
	@HostBinding('class.input-against-time-component') component_class = true; 

	@HostBinding('style.min-height') minHeight = "0px"; 

  // Object made available to template
  public GameStatus = GameStatus;
  // Atttributes used in Input
	public gameModeMetadata : GameModeMetaData =  GameModeType.GAME_INPUT;
  // Attributes in a two way binding
  public gameStatus : GameStatus = GameStatus.START;
  // Data storage for scenes transition
  public finalData : Area[] = [];
  // public currentData : Area | undefined = undefined;

  public isSmallDevice : boolean = false;

  public dataModel : FormGroup = new FormGroup({
      mapMetaData : new FormControl(),
      sourceData : new FormControl(MapsType.MAPS_LIST[0]),
      foundData : new FormControl(),
      currentValue : new FormControl(''),
      lastFound : new FormControl()
  });

  constructor(protected route: ActivatedRoute,
              protected router: Router) {
    this.processUrlParameter();
  }
  
  ngOnInit(): void {
    this.onResize();
    if(this.isSmallDevice) this.goFullScreen();
    //We set the min-height so that it's mobile adapted (because the adress bar and the header changes the way we must deal with the problem)
		this.minHeight = window.innerHeight+"px";
    // Scroll to what we are interested in
    document.getElementsByTagName("app-input-against-time")[0].scrollIntoView();
  }

  /**
   * Check if the given GameStatus is the current one
   * @param gamestatus The GameStatus to check
   * @returns True if the given GameStatus is equal to the current one
   */
  isCurrentGameStatus(gameStatus: GameStatus[]): boolean {
		return  gameStatus.some(e => this.gameStatus == e);
  }
  /**
   * Handles the start button and allows to change screen
   */
  startEventHandler(){
    this.setGameStatus(GameStatus.PLAYING);
  }

  setGameStatus(gameStatus : GameStatus){
    this.gameStatus = gameStatus;
  }

  setFinalData(areas : Area[]){
    this.finalData = areas;
  }

  /**
   * By default, try to set the game as full screen, may be inadapted.
   * @TODO Problem of compatibility with input that takes full screen width. Also with toasters that does not appear.
   * @TODO Make default behavior optional and add button to go full sreen in game
   */
  goFullScreen(){
    document.getElementsByTagName("app-input-against-time")[0].requestFullscreen().catch(e => console.error(e));
  }

  /**
	 * Get the url parameters to act appropriatly
	 */
	private processUrlParameter(){
		// Gets the url parameters
		let map : string = this.route.snapshot.queryParamMap.get('map')||"";
		// Defines that the page sould reload, not use cache (for flow control reasons)	
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;

		// If the values are correct ones, then we process them, else we redirect to choosing page with an error snackbar
		if(MapsType.isValidType(map)){
			// On force l'affectation car la vérification précédente assure que les données sont valides
      
      this.dataModel.patchValue(
      {
        mapMetaData : MapsType.getTypeFromIdentifier(map),
        sourceData :  MapsType.getTypeFromIdentifier(map)?.data
      });
		}else{
			this.router.navigate(['/maps']);
		}

		// If there where args and the maps/game mode has been disaproved, then we show error
		if(this.route.snapshot.queryParamMap.keys.length != 0 && MapsType.isValidType(map)){
		/**
		 * @TODO Implements error snackbar
		 */
		}
	}
  /**
   * Deals with windows resize
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSmallDevice = window.innerWidth<=1024;
  }
}

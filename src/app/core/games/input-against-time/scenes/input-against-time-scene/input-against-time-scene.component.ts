import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimerService } from 'src/app/shared/services/game-mode-specific/timer.service';
import { GameModeType } from 'src/app/shared/utils/types/game-mode.type';
import { GameStatus } from 'src/app/shared/utils/enums/GameStatus.enum';
import { DataSubjectService } from 'src/app/shared/services/map-specific/data-subject.service';
import { GameModeMetaData } from 'src/app/shared/utils/interfaces/game-oriented/game-mode-meta-data.interface';
import { MapMetaData } from 'src/app/shared/utils/interfaces/map-oriented/map-meta-data.interface';
import { MapsType } from 'src/app/shared/utils/types/maps.type';
import { Area } from 'src/app/shared/utils/interfaces/map-oriented/area';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-against-time-scene',
  templateUrl: './input-against-time-scene.component.html',
  styleUrls: ['./input-against-time-scene.component.scss']
})
export class InputAgainstTimeSceneComponent implements OnInit {

	private subscriptions : {[key:string]:Subscription} = {};
	public finalData : Area[] = [];

	// Input attributes
	@Input() gameModeMetadata : GameModeMetaData = GameModeType.GAME_CONSULT;
	@Input() mapMetaData : MapMetaData = MapsType.MAP_DEPARTEMENTS_FRANCE;
	@Input() isSmallDevice : boolean = false;
	// Two way binding attributes
	@Input() gameStatus: GameStatus = GameStatus.START;
	@Output() gameStatusChange : EventEmitter<GameStatus> = new EventEmitter<GameStatus>();
	// Output attributes
	@Output() finalDataChange : EventEmitter<Area[]> = new EventEmitter<Area[]>();

	@Input()  dataModel! : FormGroup;
  
  	// Data storage for child component data sharing
	public currentData : Area | undefined = undefined;
	public currentTimerValue : number = 0;
	public timerPerValue : number = 10;

	public displaySideMenu : boolean | undefined = undefined;

	constructor(protected route: ActivatedRoute,protected router: Router,protected dataSubjectService : DataSubjectService,protected timerService : TimerService) {
		this.subscriptions.currentDataChange = this.dataSubjectService.getCurrentDataChange().subscribe(value=> this.processCurrentDataChange(value));
		this.subscriptions.finalDataChange = this.dataSubjectService.getFinalDataChange().subscribe(value=> this.processFinalDataChange(value));
		this.subscriptions.currentValueChange = this.timerService.getCurrentValueChange().subscribe(value=> this.currentTimerValue = value);
	}


	ngOnInit(): void {
		this.dataSubjectService.setsourceDataValue(this.dataModel.get('sourceData')?.value);
		
		this.timerService.setUpperBound( this.dataModel.get('sourceData')?.value.length * this.timerPerValue);
    	this.currentTimerValue = this.dataModel.get('sourceData')?.value.length * this.timerPerValue;
		this.onPlaying();
		// @TODO REMOVE
		document.addEventListener('keydown',this.processKeyDown.bind(this));
	}

	/**
	 * Clear the component used static data
	 */
	ngOnDestroy(){
		this.timerService.clear();
	   
		// Unsubscribe from all registered subscriptions
		Object.keys(this.subscriptions).forEach((key : string) => {
				this.subscriptions[key].unsubscribe();
		});
	}
	/**
	 * Processes the timer value changes.
	 * @param value : The current timer value
	 */
	processCurrentTimerValueChangee(value : number){
		this.currentTimerValue = value;
  	}

  	processFinalDataChange(value : Area[]){
		if(this.gameStatus!=GameStatus.PLAYING) return; // If not int game, then shall stop
		this.finalData = value;
		if(this.dataSubjectService.checkIfAllDataFound()){
            this.setGameStatus(GameStatus.WON);
        }
  	}

	/**
	 * Processes the current data changes. Make it usable to child components.
	 * @param value : An area
	 */
	private processCurrentDataChange(value:any): void{
		this.currentData=value;
	}
	/**
	 * Implements the behaviour for when the game is launched
	 */
	onPlaying(): void {
		this.timerService.startTimer(this.onLost.bind(this));
	}
	 /**
	 * Implements the behaviour for when the game is on pause
	 */
	onPause(): void {
		this.timerService.pauseTimer();
	}
	 /**
	 * Implements the behaviour for when the player won
	 */
	onWon(): void {
		this.emitEndGameValues();
	}
	 /**
	 * Implements the behaviour for when the player lost
	 */
	onLost(): void {
		this.emitEndGameValues();
	}

	/**
	 * TO REMOVE
	 * @param ev FOR GOD SAKE REMOVE ME PLEASE 
	 * @deprecated REMOVE | FOR TEST PURPOSE
	 */
	processKeyDown(ev: KeyboardEvent){
		if(ev.key == "1") this.setGameStatus(GameStatus.LOST)
		if(ev.key == "2") this.setGameStatus(GameStatus.WON)
	}

	emitEndGameValues(){
		this.finalDataChange.emit(this.finalData);
	}

	/**
	 * Set the game status to its new value, then launch processing of the new value, before emitting the value to parent component (that may, or not, change the scene)
	 * @param gameStatus A `GameStatus` value
	 */
	setGameStatus(gameStatus : GameStatus){
		this.gameStatus = gameStatus;
		this.processGameStatusChange(this.gameStatus);
		this.gameStatusChange.emit(gameStatus);
	}

	/**
	 * Processes game status changes
	 * @param gameStatus A `GameStatus` value
	 */
	private processGameStatusChange(gameStatus : GameStatus){
		switch(gameStatus){
		  case GameStatus.PLAYING :
			this.onPlaying();
			break;
		  case GameStatus.PAUSE :
			this.onPause();
			break;
		  case GameStatus.WON :
			this.onWon();
			break;
		  case GameStatus.LOST :
			this.onLost();
			break;
		}
	  }
}

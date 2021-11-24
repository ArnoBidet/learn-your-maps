import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GameStatusService } from 'src/app/shared/services/game-mode-specific/game-status.service';
import { GameStatus } from 'src/app/shared/utils/enums/GameStatus.enum';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private interval : any;
  private upperBound : number = 0;
  private currentValue : number = -1;

  private currentValueChange : Subject<number> = new Subject<number>();

  constructor( private gameStatusService : GameStatusService ) {
    this.gameStatusService.getGameStatusChange().subscribe((value)=>{ this.handleGameStatusChange(value)});
  }

  /**
   * Handle the game status changes, and make the timer act as supposed to
   * @param gameStatus 
   */
  handleGameStatusChange(gameStatus : GameStatus){
    switch(gameStatus){
      case GameStatus.PAUSE :
        this.pauseTimer();
        break;
      case GameStatus.START :
        this.pauseTimer();
        this.resetTimer();
        break;
      case GameStatus.PLAYING :          
        this.startTimer();
        break;
      default :
        this.resetTimer();
        break;
    }
  }

  /**
   * @TODO Make the start so that it takes a function as parameter, so that anything can be done at the end
   */
  /**
   * Start the timer
   */
  startTimer() : void {
    if(this.upperBound <=0){
      console.error("Erreur : La valeur max du timer "+(this.upperBound==0?"n'a pas été initialisée.":"est inférieur à zéro.")+" Valeur actuelle : "+this.upperBound);
    }
    this.interval = setInterval(() => {
      if(this.currentValue > 0) { // If value is initialized, then starts counting
        this.updateValue(this.currentValue-1);
      } else if(this.currentValue == 0){ // If timer reach 0, then pause timer then end game
        this.pauseTimer();
        this.gameStatusService.setGameStatus(GameStatus.GAME_END);
      } else {
        this.resetTimer();
      }
    },1000)
  }
  
  /**
   * Set the current value to the timer upper bound
   */
  resetTimer() : void{
    this.updateValue(this.upperBound);
  }
  
  /**
   * Pause the timer
   */
  pauseTimer() : void{
    clearInterval(this.interval);
  }

  /**
   * Return the upper bound value
   * @returns The upperBound value
   */
  getUpperBound (): number{
    return this.upperBound;
  }

  /**
   * Return the current value that can be subscribed to
   * @returns The currentValue subject
   */
  getCurrentValueChange() : Subject<number>{
    return this.currentValueChange;
  }

  /**
   * Allow to set the timers upperbound
   * @param upperBound 
   */
  setUpperBound(upperBound : number) : void{
    this.upperBound = upperBound;
    this.updateValue(this.upperBound);
  }

  /**
   * Allows to update the value of the timer
   * @param value The new value to be set
   */
   private updateValue(value : number) : void{
    this.currentValue = value;
    this.currentValueChange.next(value);
  }



}

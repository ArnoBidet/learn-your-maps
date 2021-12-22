import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private interval : any;
  private upperBound : number = 0;
  private currentValue : number = -1;

  private currentValueChange : Subject<number> = new Subject<number>();

  constructor() {}

  /**
   * @TODO Make the start so that it takes a function as parameter, so that anything can be done at the end
   */
  /**
   * Starts the timer
   * @param onTimerEnd Callback function that is executed once the timer reaches 0.
   * @tutorial Don't forget to bind to the object if you want to use `this`
   */
  startTimer(onTimerEnd : ()=>void) : void {
    // We clear the interval to ensure the onTimerEnd function is the last one passed
    this.clearInterval();
    if(this.upperBound <=0){
      console.error("Non-fatal error : The timers upperbound "+(this.upperBound==0?"hasn't been initialized.":"is inferior to 0.")+" Current value : "+this.upperBound);
    }
    this.interval = setInterval(() => {
      if(this.currentValue > 0) { // If value is initialized, then starts counting
        this.updateValue(this.currentValue-1);
      } else if(this.currentValue == 0){ // If timer reach 0, then pause timer then end game
        this.pauseTimer();
        onTimerEnd();
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
    this.clearInterval();
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

  /**
   * Clear the timer so that it stops running and won't begin at an incorrect value
   */
  public clear(): void{
    this.clearInterval();
    this.upperBound = 0;
    this.currentValue = -1;
    this.resetTimer();
  }

  /**
   * Clears the current interval
   */
  private clearInterval(){
    clearInterval(this.interval);  
    this.interval = null;  
  }
}

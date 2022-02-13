import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../generic/templates/snack-bar/snack-bar.component';
import { GameStatus } from 'src/app/shared/utils/enums/GameStatus.enum';
import { NodeSubjectService } from 'src/app/shared/services/map-specific/node-subject.service';
import { InputSubjectService } from 'src/app/shared/services/game-mode-specific/input-subject.service';
import { DataSubjectService } from 'src/app/shared/services/map-specific/data-subject.service';

@Component({
    selector: 'app-find-area',
    templateUrl: './find-area.component.html',
    styleUrls: ['./find-area.component.scss']
})
export class FindAreaComponent implements OnInit {

    @Input() input_message : string = "";
    @Input() area_input : string = "";

    @Input() gameStatus : GameStatus = GameStatus.START;

    value : any = '';
    current_data : any = {};
    isDisabled : boolean = true;

    private subscriptions : {[key: string]: Subscription} = {};

    constructor(private inputSubjectService :InputSubjectService,
		private nodeSubjectService : NodeSubjectService,
		private dataSubjectService : DataSubjectService,
		private _snackBar: MatSnackBar) { }

	/**
	 * Lance la subscription aux différents services.
	 */
    ngOnInit(){
        // On surveille si une node est à colorer
		this.subscriptions.nodeChange = this.nodeSubjectService.getNodeChange().subscribe((value)=>{
            this.colorArea(value);
        });
        this.setDisabled(this.gameStatus != GameStatus.PLAYING);
    }

    /**
     * Detects input attributes changes and start appropriate attributes onchange function
     * @param changes A change in attributes
     */
    ngOnChanges(changes : SimpleChanges){
        if(changes.gameStatus)this.processGameStatusChange(changes.gameStatus.currentValue);
    }

    /**
	 * Clear the component used static data
	 */
	 ngOnDestroy(){
        this.inputSubjectService.clear();
		this.nodeSubjectService.clear();
        // Unsubscribe from all registered subscriptions
		Object.keys(this.subscriptions).forEach((key : string) => {
			this.subscriptions[key].unsubscribe();
		});
	}


	/**
	 * Permet de vider le champs d'input.
	 */
    clearInput(){
        this.value = "";
    }

    /**
     * Permet de mettre à jour le inputSubjectService avec la dernière valeur de l'input.
     * @param value : La valeur de l'input.
     */
    inputChanged(value : string){
        if(!this.dataSubjectService.isValidData(value)) return; // if data is not valid then stop

        if(!this.dataSubjectService.isInFinalData(value)){
            this.inputSubjectService.setInputValue(value);
            this.dataSubjectService.addDataToFinalDataFromName(value);
            // @TODO REFA, possible duplicata
            this.clearInput();
        }else{ 
            if(this.dataSubjectService.extendedNameExist(value)) return; // if an extanded version of the value exists, then stop. Else, show the user the value he already found
            this.clearInput();
            let snackMessage = "Vous avez déjà trouvé : "+value;
            this._snackBar.openFromComponent(SnackBarComponent,{data : {message:snackMessage ,action:"Okay..."},duration: 2000,panelClass: ['warn']});
        }
        
    }

    /**
     * Permet de colorer une area donné.
     * @param area : Une area à colorer.
     */
    colorArea(area : HTMLElement){
            this.clearInput();
            area!.classList.add("found");
    }

    processGameStatusChange(gameStatus : GameStatus){
        this.setDisabled(gameStatus != GameStatus.PLAYING);
    }

    /**
     * Allows to set if the input should be disabled
     * 
     * Also clear the input field if disabled, or focus on it when not
     * @param isDisabled 
     */
     setDisabled(isDisabled : boolean){
        this.isDisabled = isDisabled;
        if(this.isDisabled){
            this.clearInput();
        }else{
            document.getElementById("find-area")?.focus();
        }
    }
}

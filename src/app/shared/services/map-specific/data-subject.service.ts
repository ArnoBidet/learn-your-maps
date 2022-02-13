import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { addDataToFinalDataFromName, checkIfAllDataFound, extendedNameExist, isInFinalData, isValidData, removeAllDataFromFinalData } from '../../utils/utils/game-data.util';
import { compareNormalizedStrings, replaceSpecialChars } from '../../utils/utils/string-util';

@Injectable({
    providedIn: 'root'
})
export class DataSubjectService {

    private sourceData : any[] = [];
    private currentData : any = {};
    private finalData : any[] = [];

    private sourceDataChange : Subject<any[]> = new Subject<any[]>();
    private currentDataChange : Subject<any> = new Subject<any>();
    private finalDataChange : Subject<any[]> = new Subject<any[]>();

    constructor() {
        this.sourceDataChange.subscribe((value)=>{this.sourceData = value;});
        this.currentDataChange.subscribe((value)=>{this.currentData = value;});
        this.finalDataChange.subscribe((value)=>{this.finalData = value;});
    }

    /**
     * Return the Subject object of the source data
     * @returns The sourceDataChange object to subscribe to
     */
    public getSourceDataChange() : Subject<any[]>{
        return this.sourceDataChange;
    }
    /**
     * Return the Subject object of the final data
     * @returns The finalDataChange object to subscribe to
     */
    public getFinalDataChange() : Subject<any[]>{
        return this.finalDataChange;
    }
    /**
     * Return the Subject object of the current data
     * @returns The currentDataChange object to subscribe to
     */
    public getCurrentDataChange() : Subject<any>{
        return this.currentDataChange;
    }

    /**
     * Permet de mettre en place la source de données.
     * @param array : La liste de données source.
     */
     public setsourceDataValue(array : any[]) : void{
        this.sourceDataChange.next(array);
    }
    /**
     * Permet d'indiquer l'objet en cours de traitement.
     * @param obj : L'objet en cours de traitement.
     */
     public setCurrentDataValue(obj : any) : void{
        this.currentDataChange.next(obj);
    }
    /**
     * Permet d'ajouter un objet à la liste des données actuels à partir du nom de celui-ci
     * Also check if all the data has been found, if so, then set the game status to "WON"
     * @param obj 
     */
     public addDataToFinalDataFromName(name : string) : void{
        addDataToFinalDataFromName(this.sourceData, this.finalData, name);
    }
    
    /**
     * Add an object to the found data list. Also check if the player won.
     * @param obj 
     */
     public addDataToFinalData(obj : any) : void{
        this.finalData.push(obj);
        this.finalDataChange.next(this.finalData);
    }

    /**
     * Permet d'ajouter un objet à la liste des données actuels.
     * @param obj 
     */
     public removeDataFromFinalData(obj : any) : void{
        this.finalData.splice(this.finalData.indexOf(obj), 1);
        this.finalDataChange.next(this.finalData);
    }

    /**
     * Permet d'ajouter un objet à la liste des données actuels.
     * @param obj 
     */
     public removeAllDataFromFinalData() : void{
        removeAllDataFromFinalData(this.finalData);
        this.finalDataChange.next([]);
    }

    /**
     * Permet de mettre en place la liste actuel de données (dans le cadre d'un jeu).
     * @param array : La liste actuel de données trouvées
     */
     public setFinalDataValue(array : any[]) : void{
        this.finalDataChange.next(array);
    }
    /**
     * Permet de savoir si l'objet donné fait partie des valeur de la liste de base
     * @param obj : Le nom à vérifier.
     * @returns Vrai si l'objet est dans la liste, faux sinon.
     */
     public isValidData(name : string) : boolean{
        return isValidData(this.sourceData, name);
    }
    /**
     * Permet de savoir si l'objet donné figure déjà parmis les données trouvées.
     * @param obj : Le nom à vérifier.
     * @returns Vrai si l'objet est dans la liste, faux sinon.
     */
     public isInFinalData(name : string) : boolean{
        return isInFinalData(this.finalData, name);
    }

    /**
     * Allows to know if an area which could be considered as an extension of an already found area exists.
     * E.g : "Loire" and "Loiret"
     * @param name : A name, of anything
     * @returns True if one or more exists
     */
    public extendedNameExist(name : string) : boolean{
        return extendedNameExist(this.sourceData, name);
    }

    /**
     * Returns the source data lenght
     * @returns The source data length
     */
    public getSourceDataLength() : number {
        return this.sourceData.length;
    }

    /**
     * Check if all the data has been found
     * @returns 
     */
    public checkIfAllDataFound() : boolean{
        return checkIfAllDataFound(this.sourceData, this.finalData);
    }

    /**
     * Set the currents data to null
     */
    public clear() : void {
        this.setCurrentDataValue({});
        this.setsourceDataValue([]);
        this.setFinalDataValue([]);
    }
}
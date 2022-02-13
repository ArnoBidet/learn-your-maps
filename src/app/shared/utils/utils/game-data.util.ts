import { compareNormalizedStrings, replaceSpecialChars } from "./string-util";

/**
 * Permet d'ajouter un objet à la liste des données actuels à partir du nom de celui-ci
 * Also check if all the data has been found, if so, then set the game status to "WON"
 * @param obj 
 */
export function addDataToFinalDataFromName(sourceData : any[], finalData : any[], name : string) : void{
    let result = sourceData.find((value) => replaceSpecialChars(name) == replaceSpecialChars(value.name)); 
    addDataToFinalData(finalData, result);
}

/**
 * Add an object to the found data list. Also check if the player won.
 * @param obj 
 */
 export function addDataToFinalData(finalData : any[], obj : any) : void{
    finalData.push(obj);
}

/**
 * Permet d'ajouter un objet à la liste des données actuels.
 * @param obj 
 */
 export function removeDataFromFinalData(finalData : any[],obj : any) : void{
    finalData.splice(finalData.indexOf(obj), 1);
}

/**
 * Permet d'ajouter un objet à la liste des données actuels.
 * @param obj 
 */
 export function removeAllDataFromFinalData(finalData : any[]) : void{
    finalData = [];
}

/**
 * Permet de savoir si l'objet donné fait partie des valeur de la liste de base
 * @param obj : Le nom à vérifier.
 * @returns Vrai si l'objet est dans la liste, faux sinon.
 */
 export function isValidData(sourceData : any[], name : string) : boolean{
    return sourceData.find((value)=>{return compareNormalizedStrings(value.name , name)});
}
/**
 * Permet de savoir si l'objet donné figure déjà parmis les données trouvées.
 * @param obj : Le nom à vérifier.
 * @returns Vrai si l'objet est dans la liste, faux sinon.
 */
 export function isInFinalData(finalData : any[],name : string) : boolean{
    return finalData.find((value)=>{
        return compareNormalizedStrings(value.name , name)
    });
}

/**
 * Allows to know if an area which could be considered as an extension of an already found area exists.
 * E.g : "Loire" and "Loiret"
 * @param name : A name, of anything
 * @returns True if one or more exists
 */
export function extendedNameExist(sourceData : any[],name : string) : boolean{
    var regex = new RegExp('^'+replaceSpecialChars(name)+'.+');
    return sourceData.find((value)=>{
        return replaceSpecialChars(value.name).match(regex);
    });
}

/**
 * Returns the source data lenght
 * @returns The source data length
 */
export function getSourceDataLength(sourceData : any[]) : number {
    return sourceData.length;
}

/**
 * Check if all the data has been found
 * @returns 
 */
export function checkIfAllDataFound(sourceData : any[], finalData : any[]) : boolean{
    return sourceData.length == finalData.length;
}
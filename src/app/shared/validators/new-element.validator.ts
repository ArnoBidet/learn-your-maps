import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function isNewElement(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? {forbiddenName: {value: control.value}} : null;
    };
}

export function hasExtendedValueFound(currentValue : any, foundList : [], sourceList : []): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      
      return null;
    }
}

/**
 * Allows to know if an area which could be considered as an extension of an already found area exists.
 * E.g : "Loire" and "Loiret"
 * @param name : A name, of anything
 * @returns True if one or more exists
 */
export function extendedNameExist(name : string) : boolean{
  let stringFactory = new StringFactory()
  var regex = new RegExp('^'+stringFactory.replaceSpecialChars(name)+'.+');
  return this.sourceData.find((value)=>{
   return stringFactory.replaceSpecialChars(value.name).match(regex);
  });
}
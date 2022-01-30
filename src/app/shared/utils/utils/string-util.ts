/**
 * Replace accented char by their ascii equivalent. To lower case and space replaced by hyphen.
 * @param str : A string to normalise
 * @returns The normalized string
 */
export function replaceSpecialChars(str : string){
    return  removeExtraHypensFromBeginning(
            replaceMultipleHyphensByOne(
            replaceSpaceWithHyphens(
            replaceAccents(str.normalize('NFD').toLowerCase())))); 
}

/**
 * Replace accented char by their ascii equivalent
 * @param str : String to modify
 * @returns Modified string
 */
export function replaceAccents(str : string){
    return str.replace(/[\u0300-\u036f]/g, ''); // 
}

/**
 * Replace space and other characters by hyphen
 * @param str : String to modify
 * @returns Modified string
 */
export function replaceSpaceWithHyphens(str : string){
    return str.replace(/([^\w]+|\s+)/g, '-');
}

/**
 * Replaces multiple hyphens by one hyphen
 * @param str : String to modify
 * @returns Modified string
 */
export function replaceMultipleHyphensByOne(str : string){
    return str.replace(/\-\-+/g, '-');
}

/**
 * Remove extra hyphens from beginning or end of the string
 * @param str : String to modify
 * @returns Modified string
 */
export function removeExtraHypensFromBeginning(str : string){
    return str.replace(/(^-+|-+$)/, '');// 
}

/**
 * Compare string aftrer normalization
 * @param str1 : Le premier string
 * @param str2 : Le deuxième string
 * @returns True si les deux sont identiques après normalisation
 */
export function compareNormalizedStrings(str1: string, str2 : string){
    return replaceSpecialChars(str1) == replaceSpecialChars(str2);
}
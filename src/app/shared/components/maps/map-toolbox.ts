import { Component, OnInit } from "@angular/core";
import { DataSubjectService } from "../../services/map-specific/data-subject.service";
import { Area } from "../../utils/interfaces/map-oriented/area";
import { NodeSubjectService } from "../../services/map-specific/node-subject.service";
import { InputSubjectService } from "../../services/game-mode-specific/input-subject.service";
import { Subscription } from "rxjs";
import { replaceSpecialChars } from "../../utils/utils/string-util";



@Component({
    template:``
})
export class MapToolbox implements OnInit {

    /**
     * Point vocabulaire :
     *  - Une Area est l'équivalent d'un département, d'une préfecture.
     *  - Une Zone est l'équivalent d'une région, ou d'un regroupement d'area plus généralement.
     *  - Un Country est un ensemble de Zone.  
     */
    name : string = "";
    identifier : string = "";
    data : any[] = [];
    area_identifier : string = ""

    currentSelected : HTMLElement | null = null;

    protected subscriptions : {[key:string]:Subscription} = {};

    /**
     * Initialisation des services.
     */
    constructor(protected inputSubjectService :InputSubjectService,
                protected nodeSubjectService : NodeSubjectService,
                protected dataSubjectService : DataSubjectService){
        this.inputSubjectService = inputSubjectService;
        this.nodeSubjectService = nodeSubjectService;
        this.dataSubjectService = dataSubjectService;
    }

    /**
     * Set data binding
     */
    ngOnInit(){
        // On surveille la liste des valeur mise en zone input
        this.subscriptions.inputChange = this.inputSubjectService.getInputChange().subscribe((value : string)=>this.processInputChange(value));
        this.subscriptions.sourceDataChange = this.dataSubjectService.getSourceDataChange().subscribe((value : any[]) =>this.processSourceDataChange(value));
        this.subscriptions.currentDataChange = this.dataSubjectService.getCurrentDataChange().subscribe((value : any) =>this.processCurrentDataChange(value));
    }

    /**
     * Search then add the html element linked to given input to the node service
     * @param value An area name
     */
    private processInputChange(value : string){
        // Si la valeur en input correspond à une zone/area, alors on récupère la node associé
        let area = this.getAreaByName(value);
        if (area){
            this.getAreaNode(area.num);
        }
    }

    /**
     * Sets the current object data to the current source data
     * @param data The new data
     */
     private processSourceDataChange(data : any[]){
        this.data = data;
    }

    /**
     * Sets the current object data to the current source data
     * @param data The new data
     */
     private processCurrentDataChange(data : any){
        try{
            this.currentSelected?.classList.remove("selected");
            this.currentSelected = document.getElementById("area-" + data.num?.toLowerCase());
            this.currentSelected?.classList.add("selected");    
        }catch(e){
            console.error(e);
        }
    }

    /**
     * Enable area discovery by clicking on svgs nodes
     * @TODO replace with a proper version that prevents unwanted clicking 
     */
    public generateOnClickEvent(){
        Array.from(document.getElementsByClassName("land")).forEach((land : Element )=>{
            land.addEventListener('click', ()=>{
                this.getAreaByName(land.id.replace("area-",""));
                let result = this.data.find(({ num }) => land.id.replace("area-","").toLowerCase() == num.toLowerCase());
                if(result){
                    this.dataSubjectService.setCurrentDataValue(result);
                }
            });
        });
    }

    /**
     * Search for the element 
     * @param {*} numarea : Le numéro du département
     */
    getAreaNode(area : string) {
        let result = document.getElementById("area-" + area.toLowerCase());
        if(result){// Si on a bien une valeur
            this.nodeSubjectService.setNodeValue(result)
        }
    }

    /**
     * Retourne le département si il existe ou retourne undefined
     * @param area_name : Le nom de l'area
     * @returns Le département ou undefined
     */
    getAreaByName(input_area_name : string) : Area {
        let result = this.data.find(({ name }) => replaceSpecialChars(input_area_name) == replaceSpecialChars(name));
        if(result){// Si on a bien une valeur.
            this.dataSubjectService.setCurrentDataValue(result);
        }
        return result;
    }

    /**
     * Returns all area from a zone
     * @param zone_name 
     * @returns 
     */
    getAreasFromZone(zone_name : string) {
        return this.data.filter(({ name }) => {
            (replaceSpecialChars(name) ==  replaceSpecialChars(zone_name));
        });
    }

    /**
     * Function to color the map for result display. Showing which were not found, and which were.
     * @param finalData 
     * @TODO Refacto or move
     */
    colorResult(finalData : Area[]){        
        this.data.forEach((value : Area)=>{
            setTimeout(()=>document.getElementById("area-" + value.num.toLowerCase())!.classList.add(finalData.find(area => area.iso_3166 === value.iso_3166)?"valid":"not-valid"));
        });
    }
}
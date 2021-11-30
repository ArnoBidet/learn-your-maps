import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationComponent } from './consultation/consultation.component';
import { InputAgainstTimeComponent } from './input-against-time/input-against-time.component';

import { MaterialModule } from 'src/app/material.module';
import { MapsGamesModule } from 'src/app/shared/components/maps-games/maps-games.module';
import { DataTableModule } from 'src/app/shared/components/generic/data-table/data-table.module';
import { GenericModule } from 'src/app/shared/components/generic/generic.module';
import { MapsModule } from 'src/app/shared/components/maps/maps.module';

@NgModule({
  declarations: [
    ConsultationComponent,
    InputAgainstTimeComponent
  ],
  imports: [
    CommonModule,
    MapsGamesModule,
    DataTableModule,
    MaterialModule,
    GenericModule,
    MapsModule
  ]
})
export class GamesModule { }

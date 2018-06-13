import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RoutingConstants} from './RoutingConstants';
import {PatientsListComponent} from '../../pages/patients-list/patients-list.component';
import {PatientPageComponent} from '../../pages/patient-page/patient-page.component';
const appRoutes: Routes = [
  {path: RoutingConstants.PATIENTS_PAGE, component: PatientsListComponent},
  {path: RoutingConstants.PATIENT_DETAILS_LINK, component: PatientPageComponent},
  {path: '**', redirectTo: RoutingConstants.PATIENTS_PAGE, pathMatch: 'full'}
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }

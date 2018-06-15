import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PatientsListComponent} from './patients-list/patients-list.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {PatientPageComponent} from './patient-page/patient-page.component';
import {FunctionalModule} from '../functional/functional.module';
import {PatientDetailsComponent} from './patient-page/patient-details/patient-details.component';
import {PatientMedicationComponent} from './patient-page/patient-medication/patient-medication.component';
import {PatientObservationComponent} from './patient-page/patient-observation/patient-observation.component';
import {MglTimelineModule} from 'angular-mgl-timeline';
import { ObservationsChartComponent } from './patient-page/observations-chart/observations-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    FunctionalModule,
    MglTimelineModule,
    NgxChartsModule
  ],
  declarations: [
    PatientsListComponent,
    PatientPageComponent,
    PatientDetailsComponent,
    PatientMedicationComponent,
    PatientObservationComponent,
    ObservationsChartComponent
  ],
  exports: [PatientsListComponent]
})
export class PagesModule {
}

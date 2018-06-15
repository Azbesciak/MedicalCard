import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PatientsListComponent} from './patients-list/patients-list.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {PatientPageComponent} from './patient-page/patient-page.component';
import {FunctionalModule} from '../functional/functional.module';
import {PatientDetailsComponent} from './patient-page/patient-details/patient-details.component';
import {PatientMedicationComponent} from './patient-page/patient-medication/patient-medication.component';
import {PatientObservationComponent} from './patient-page/patient-observation/observations-timeline/patient-observation.component';
import {MglTimelineModule} from 'angular-mgl-timeline';
import { ObservationsChartComponent } from './patient-page/patient-observation/observations-chart/observations-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { PatientEditComponent } from './patient-page/patient-edit/patient-edit.component';
import { ObservationFilterComponent } from './patient-page/patient-observation/observation-filter/observation-filter.component';

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
    ObservationsChartComponent,
    PatientEditComponent,
    ObservationFilterComponent
  ],
  exports: [PatientsListComponent],
  entryComponents: [PatientEditComponent]
})
export class PagesModule {
}

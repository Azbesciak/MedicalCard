import { Component, OnInit } from '@angular/core';
import {DataService} from '../../functional/data/data.service';
import {ActivatedRoute} from '@angular/router';
import {FlatObservation, FlatPatient} from '../../main/models/models';
import Observation = fhir.Observation;
import Bundle = fhir.Bundle;

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent implements OnInit {
  patient: FlatPatient;
  observations: Bundle;
  medicationRequests: Bundle;
  constructor(private data: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log(id);
      this.getDataForPatient(id);
    });
  }

  getDataForPatient(patientId: string) {
    this.data.getPatientData(patientId).then(p => this.patient = FlatPatient.fromResource(p));
    this.data.getPatientMedicationRequests(patientId)
      .then(p => this.medicationRequests = p);
    this.data.getPatientObservations(patientId)
      .then(o => this.observations = o);
  }


}

class PatientEveryting {
  constructor() {}
}

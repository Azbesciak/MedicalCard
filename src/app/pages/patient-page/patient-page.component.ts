import {Component, OnInit} from '@angular/core';
import {DataService} from '../../functional/data/data.service';
import {ActivatedRoute} from '@angular/router';
import {FlatPatient} from '../models';
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

  constructor(private data: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log(id);
      this.getDataForPatient(id);
    });
  }

  getDataForPatient(patientId: string) {
    this.data.getPatientData(patientId, false)
      .then(p => this.patient = FlatPatient.fromResource(p));
    this.data.getPatientMedicationRequests(patientId, 50, false)
      .then(p => this.medicationRequests = p);
    this.data.getPatientObservations(patientId, 50, false)
      .then(o => this.observations = o);
  }
}

class PatientEveryting {
  constructor() {
  }
}

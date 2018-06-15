import {Component, OnInit} from '@angular/core';
import {DataService} from '../../functional/data/data.service';
import {ActivatedRoute} from '@angular/router';
import {FlatObservation, FlatPatient} from '../models';
import Bundle = fhir.Bundle;
import BundleEntry = fhir.BundleEntry;
import Observation = fhir.Observation;
import MedicationRequest = fhir.MedicationRequest;
import {getNavigation, getResources} from '../utility';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent implements OnInit {
  patientId: string;
  observationsBus = new BehaviorSubject<FlatObservation[]>([]);
  medicationRequests: MedicationRequest[] = [];

  constructor(private data: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.patientId = params.get('id');
      this.getDataForPatient(this.patientId);
    });
  }

  getDataForPatient(patientId: string) {
    this.data.getPatientMedicationRequests(patientId, 50, false)
      .then(async o => {
        let navigation = getNavigation(o);
        this.medicationRequests.push(...getResources(o));
        this.medicationRequests = this.medicationRequests.slice();
        while (navigation.hasNext()) {
          const res = await this.data.get(navigation.next);
          navigation = getNavigation(res);
          this.medicationRequests.push(...getResources(res));
          this.medicationRequests = this.medicationRequests.slice();
        }
      });

  }
}

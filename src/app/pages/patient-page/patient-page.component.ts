import {Component, OnInit} from '@angular/core';
import {DataService} from '../../functional/data/data.service';
import {ActivatedRoute} from '@angular/router';
import {FlatObservation, FlatPatient} from '../models';
import Bundle = fhir.Bundle;
import BundleEntry = fhir.BundleEntry;
import Observation = fhir.Observation;
import MedicationRequest = fhir.MedicationRequest;
import {getAll, getNavigation, getResources} from '../utility';
import {BehaviorSubject, Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {PatientHistoryComponent, PatientHistoryData} from './patient-history/patient-history.component';
import Resource = fhir.Resource;

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent implements OnInit {
  patientId: string;
  observationsBus = new BehaviorSubject<FlatObservation[]>([]);
  medicationRequests: MedicationRequest[] = [];

  constructor(private data: DataService, private route: ActivatedRoute, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.patientId = params.get('id');
      this.getDataForPatient(this.patientId);
    });
  }

  getDataForPatient(patientId: string) {
    const subject = new Subject<any[]>();
    subject.subscribe(m => this.medicationRequests = m);
    this.data.getPatientMedicationRequests(patientId, 50, false)
      .then(o => getAll(o, subject, this.data));
  }

  showPatientHistoryDialog() {
    this.dialog.open(PatientHistoryComponent, {
      width: '750',
      data: new PatientHistoryData(this.patientId)
    });
  }
}

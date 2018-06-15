import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataService} from '../../../functional/data/data.service';
import {getResources} from '../../utility';
import {FlatPatient} from '../../models';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PatientHistoryComponent>,
              @Inject(MAT_DIALOG_DATA) private data: PatientHistoryData,
              private dataService: DataService) {
  }

  patientId = this.data.patientId;
  patients: FlatPatient[];
  newest: FlatPatient;
  ngOnInit() {
    this.dataService.getPatientHistory(this.patientId).then(h => {
      this.patients = getResources(h).map(p => FlatPatient.fromResource(p));
      console.log(this.patients);
      this.newest = this.patients[0];
    });
  }

}

export class PatientHistoryData {
  constructor(public patientId: string) {
  }
}

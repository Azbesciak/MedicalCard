import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import Patient = fhir.Patient;

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.scss']
})
export class PatientEditComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PatientEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PatientEditComponentData) { }

  ngOnInit() {
  }

  closeDialog(res = false) {
    this.dialogRef.close(res);
  }
}


export class PatientEditComponentData {
  constructor(public patient: Patient,
              public callback: (patient: Patient) => Promise<any>
  ) {}
}


import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import Patient = fhir.Patient;
import {Form} from '@angular/forms';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.scss']
})
export class PatientEditComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PatientEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PatientEditComponentData) { }
  patient: Patient;

  @ViewChild('editForm')
  editForm: Form;
  ngOnInit() {
    this.patient = JSON.parse(JSON.stringify(this.data.patient));
  }

  closeDialog(res = false) {
    this.dialogRef.close(res);
  }

  onAccept() {
    this.correctFields();
    this.data.callback(this.patient).then(s => this.closeDialog(false));
  }

  correctFields() {
    this.patient.name.forEach(n => {
      n.given = Array.isArray(n.given) ? n.given : [n.given];
      n.prefix = Array.isArray(n.prefix) ? n.prefix : [n.prefix];
    });
  }
}


export class PatientEditComponentData {
  constructor(public patient: Patient,
              public callback: (patient: Patient) => Promise<any>
  ) {}
}


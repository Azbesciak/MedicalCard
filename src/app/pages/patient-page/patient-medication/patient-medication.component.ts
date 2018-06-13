import {Component, Input, OnInit} from '@angular/core';
import Bundle = fhir.Bundle;

@Component({
  selector: 'app-patient-medication',
  templateUrl: './patient-medication.component.html',
  styleUrls: ['./patient-medication.component.scss']
})
export class PatientMedicationComponent implements OnInit {

  @Input('medicationRequest')
  medicationRequest: Bundle;

  constructor() { }

  ngOnInit() {

  }

}

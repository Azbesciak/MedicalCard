import {Component, Input, OnInit} from '@angular/core';
import Bundle = fhir.Bundle;
import MedicationRequest = fhir.MedicationRequest;
import {FlatMedicationRequest} from '../../models';

@Component({
  selector: 'app-patient-medication',
  templateUrl: './patient-medication.component.html',
  styleUrls: ['./patient-medication.component.scss']
})
export class PatientMedicationComponent implements OnInit {

  @Input('medicationRequest')
  medicationRequest: Bundle;

  flatMedicationRequests: FlatMedicationRequest[];

  constructor() { }

  ngOnInit() {
    this.flatMedicationRequests = (this.medicationRequest.entry || [])
      .map(r => r.resource as MedicationRequest)
      .map(r => FlatMedicationRequest.fromResource(r));
  }

}

import {Component, Input, OnInit} from '@angular/core';
import MedicationRequest = fhir.MedicationRequest;
import {FlatMedicationRequest} from '../../models';

@Component({
  selector: 'app-patient-medication',
  templateUrl: './patient-medication.component.html',
  styleUrls: ['./patient-medication.component.scss']
})
export class PatientMedicationComponent implements OnInit {
  isAnyData: boolean;
  private recentTimeout: any;
  get medicationRequest(): MedicationRequest[] {
    return this._medicationRequest;
  }
  @Input('medicationRequest')
  set medicationRequest(value: MedicationRequest[]) {
    this._medicationRequest = value;
    this.flatMedicationRequests = value.map(r => FlatMedicationRequest.fromResource(r));
    clearTimeout(this.recentTimeout);
    this.recentTimeout = setTimeout(() => {
      this.isAnyData = this.flatMedicationRequests.length > 0;
    }, 50);
  }

  private _medicationRequest: MedicationRequest[];

  flatMedicationRequests: FlatMedicationRequest[];

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {FlatPatient} from '../../models';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {

  @Input('patient')
  patient: FlatPatient;

  languages: string;

  constructor() { }

  ngOnInit() {
    this.languages = this.patient.communications
      .map(com => com.language.coding.map(c => c.display).join(', '))
      .join(', ');
  }

}

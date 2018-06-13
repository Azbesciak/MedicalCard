import {Component, Input, OnInit} from '@angular/core';
import {FlatObservation} from '../../../main/models/models';
import Bundle = fhir.Bundle;
import Observation = fhir.Observation;

@Component({
  selector: 'app-patient-observation',
  templateUrl: './patient-observation.component.html',
  styleUrls: ['./patient-observation.component.scss']
})
export class PatientObservationComponent implements OnInit {

  @Input('observations')
  observations: Bundle;

  flatObservations: FlatObservation[];

  constructor() {
  }

  ngOnInit() {
    console.log(this.observations);
    this.flatObservations = (this.observations.entry || [])
      .map(o => o.resource)
      .map(r => FlatObservation.fromResource(r as Observation));
  }

}


import {Component, Input, OnInit} from '@angular/core';
import {FlatObservation} from '../../models';
import Observation = fhir.Observation;

@Component({
  selector: 'app-patient-observation',
  templateUrl: './patient-observation.component.html',
  styleUrls: ['./patient-observation.component.scss']
})
export class PatientObservationComponent implements OnInit {
  get observations(): Observation[] {
    return this._observations;
  }

  isAnyData: boolean;
  private recentTimeout: any;
  @Input('observations')
  set observations(value: Observation[]) {
    this._observations = value;
    this.flatObservations = value
      .map(r => FlatObservation.fromResource(r));
      clearTimeout(this.recentTimeout);
    this.recentTimeout = setTimeout(() => {
      this.isAnyData = this.flatObservations.length > 0;
    }, 50);
  }

  private _observations: Observation[];

  flatObservations: FlatObservation[];

  constructor() {
  }

  ngOnInit() {

  }

}


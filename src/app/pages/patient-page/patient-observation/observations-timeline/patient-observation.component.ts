import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FlatObservation} from '../../../models';

@Component({
  selector: 'app-patient-observation',
  templateUrl: './patient-observation.component.html',
  styleUrls: ['./patient-observation.component.scss']
})
export class PatientObservationComponent implements OnInit {

  @Input('observationsBus')
  observationsBus: BehaviorSubject<FlatObservation[]>;

  observations: FlatObservation[];

  constructor() {
  }

  ngOnInit() {
    this.observationsBus.subscribe(o => this.observations = o);
  }

}


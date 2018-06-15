import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FlatObservation} from '../../../models';
import {getNavigation, getResources} from '../../../utility';
import {DataService} from '../../../../functional/data/data.service';
import Bundle = fhir.Bundle;

@Component({
  selector: 'app-observation-filter',
  templateUrl: './observation-filter.component.html',
  styleUrls: ['./observation-filter.component.scss']
})
export class ObservationFilterComponent implements OnInit {

  @Input('observationsBus')
  observationsBus: BehaviorSubject<FlatObservation[]>;

  @Input('patientId')
  patientId: string;

  dateTo: Date;
  dateFrom: Date;

  maxDateFrom: Date;
  minDateTo: Date;

  firstObservationDate: Date;
  lastObservationDate: Date;
  observations: FlatObservation[] = [];
  constructor(private data: DataService) { }

  private assignNewObservations(o: Bundle) {
    const observations = getResources(o).map(r => FlatObservation.fromResource(r));
    this.observations.push(...observations);
  }

  ngOnInit() {
    this.data.getPatientObservations(this.patientId, 50, false)
      .then(async o => {
        let navigation = getNavigation(o);
        this.assignNewObservations(o);
        while (navigation.hasNext()) {
          const res = await this.data.get(navigation.next);
          navigation = getNavigation(res);
          this.assignNewObservations(o);
        }
        this.observations.sort((s1, s2) => s1.issued.getTime() - s2.issued.getTime());
        this.setDates(this.observations);
        this.observationsBus.next(this.observations);
      });
  }

  setDates(observations: FlatObservation[]) {
    if (observations.length > 0) {
      this.firstObservationDate = observations[0].issued;
      this.lastObservationDate = this.observations[observations.length - 1].issued;
      this.maxDateFrom = this.firstObservationDate;
      this.maxDateFrom = this.lastObservationDate;
      this.dateFrom = !this.dateFrom || this.dateFrom.getTime() < this.firstObservationDate.getTime()
        ? this.firstObservationDate
        : this.dateFrom;
      this.dateTo = !this.dateTo || this.dateTo.getTime() > this.lastObservationDate.getTime()
        ? this.lastObservationDate
        : this.dateTo;
    }
  }

  onDateFromChange() {
    this.minDateTo = this.dateFrom || this.firstObservationDate;
    this.filterObservations();
  }

  onDateToChange() {
    this.maxDateFrom = this.dateTo || this.lastObservationDate;
    this.filterObservations();
  }

  filterObservations() {
    const filtered = this.observations.filter(o =>
      (!this.dateTo || this.dateTo >= o.issued) &&
      (!this.dateFrom || this.dateFrom <= o.issued)
    );
    this.observationsBus.next(filtered);
  }

}

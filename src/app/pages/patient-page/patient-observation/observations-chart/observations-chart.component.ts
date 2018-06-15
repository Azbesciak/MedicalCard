import {Component, Input, OnInit} from '@angular/core';
import {ChartSeries, FlatObservation, ObservationWithDateComponent} from '../../../models';
import {of} from 'rxjs';
import {mergeMap, groupBy, reduce, map} from 'rxjs/operators';
import {MatSelectChange} from '@angular/material';

@Component({
  selector: 'app-observations-chart',
  templateUrl: './observations-chart.component.html',
  styleUrls: ['./observations-chart.component.scss']
})
export class ObservationsChartComponent implements OnInit {
  currentObservation: string = null;
  chartData: ChartSeries[];
  observationTypes: string[] = [];
  xAxisLabel = 'Time';
  yAxisLabel = null;
  allValues: Map<string, ChartSeries[]> = new Map<string, ChartSeries[]>();

  get flatObservations(): FlatObservation[] {
    return this._flatObservations;
  }

  @Input('observations')
  set flatObservations(value: FlatObservation[]) {
    this.allValues.clear();
    this._flatObservations = value;
    of(this._flatObservations).pipe(
      mergeMap(o => o),
      mergeMap(o => o.components),
      groupBy(c => c.code.text),
      mergeMap(o => o.pipe(
        reduce((acc, cur: ObservationWithDateComponent) =>
          [...acc, Object.assign({name: cur.date}, cur.valueQuantity)], []
        ),
        map(g => new ChartSeries(o.key, g))
      ))
    ).subscribe((v: ChartSeries) => this.allValues.set(v.name, [v]),
      () => {},
      () => {
        this.observationTypes = Array.from(this.allValues.keys());
        const areAnyObservations = this.observationTypes.length > 0;
        if ((this.currentObservation == null || !this.allValues.has(this.currentObservation)) && areAnyObservations) {
          this.currentObservation = this.observationTypes[0];
        }
        if (areAnyObservations) {
          this.setObservationType(this.currentObservation);
        }
      }
    );
  }

  _flatObservations: FlatObservation[];

  constructor() {
  }

  ngOnInit() {

  }

  private setObservationType(observationType: string) {
    this.currentObservation = observationType;
    this.chartData = this.allValues.get(this.currentObservation);
    this.yAxisLabel = `${this.observationTypes[0]} [${this.chartData[0].series[0].unit}]`;
  }

  onObservationChange($event: MatSelectChange) {
    const value = $event.value;
    this.setObservationType(value);
  }
}

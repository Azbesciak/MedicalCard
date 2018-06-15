import {Component, Input, OnInit} from '@angular/core';
import {ChartSeries, FlatObservation, ObservationWithDateComponent} from '../../models';
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
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = null;
  autoScale = true;
  allValues: Map<string, ChartSeries[]> = new Map<string, ChartSeries[]>();

  get flatObservations(): FlatObservation[] {
    return this._flatObservations;
  }

  @Input('observations')
  set flatObservations(value: FlatObservation[]) {
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
      if (this.currentObservation == null && this.observationTypes.length > 0) {
        this.setObservationType(this.observationTypes[0]);
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

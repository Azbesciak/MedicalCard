import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataService} from '../../../functional/data/data.service';
import {getAll, getResources} from '../../utility';
import {FlatPatient} from '../../models';
import {Comparer} from './comparer';
import {FieldFilter} from './field-filter';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PatientHistoryComponent>,
              @Inject(MAT_DIALOG_DATA) private data: PatientHistoryData,
              private dataService: DataService) {
  }

  comparer = new Comparer();
  filter = new FieldFilter(['meta.*']);
  patientId = this.data.patientId;
  patients: FlatPatient[];
  targetItemsA: FlatPatient[] = [];
  targetItemsB: FlatPatient[] = [];
  flatDif: FlatDif[];

  ngOnInit() {
    const subject = new Subject<any[]>();
    subject.subscribe(p => this.patients = p);
    this.dataService.getPatientHistory(this.patientId)
      .then(h => getAll(h, subject, this.dataService, FlatPatient.fromResource));
  }

  onDropMade($event: any, container: any[]) {
    if (container.length > 0) {
      container.splice(0, container.length);
      container.push($event.value);
    }
    if (this.targetItemsA.length > 0 && this.targetItemsB.length > 0) {
      let dif = this.comparer.compare(this.targetItemsA[0].raw, this.targetItemsB[0].raw);
      dif = this.filter.filter(dif);
      this.flatDif = Object.entries(dif).map((e: any) => new FlatDif(e[0], e[1].type, e[1].data, e[1].before, e[1].after));
    } else {
      this.flatDif = [];
    }
  }
}

export class PatientHistoryData {
  constructor(public patientId: string) {
  }
}

export class FlatDif {
  label: string;

  constructor(public key: string, public type: string, public value: any, public before: any, public after: any) {
    if (type === Comparer.VALUE_UPDATED) {
      this.label = `Left: ${before}, Right: ${after}`;
    } else {
      this.label = value;
    }
    this.key = this.key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/\./g, ' ');
  }
}

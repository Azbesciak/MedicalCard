import {Component, OnInit} from '@angular/core';
import {DataService} from '../../functional/data/data.service';
import {Router} from '@angular/router';
import {RoutingConstants} from '../../functional/routing/RoutingConstants';
import {FlatPatient} from '../models';
import BundleLink = fhir.BundleLink;
import Patient = fhir.Patient;

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'id', 'gender'];
  patients: any[];
  nextPage: BundleLink;
  previousPage: BundleLink;
  total: number;
  fields = FlatPatient.getFields();
  searchedName: string;

  constructor(private data: DataService, private router: Router) {
  }

  ngOnInit() {
    this.getPatients('', false);
  }

  getPatientsWithName() {
    this.getPatients(this.searchedName, false);
  }

  getPatients(name: string, force) {
    console.log('request sent');
    this.data.getAllPatients(name, 20, force).then(r => {
      this.patients = (r.entry || []).map(p => FlatPatient.fromResource(p.resource as Patient));
      console.log(r);
      const relations = r.link;
      this.nextPage = relations.find(rel => rel.relation === 'next');
      this.previousPage = relations.find(rel => rel.relation === 'previous');
    });
  }

  onRowClick(row: FlatPatient) {
    this.router.navigate([RoutingConstants.PATIENTS_PAGE, row.id]);
  }
}

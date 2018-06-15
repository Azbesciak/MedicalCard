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
  count = 20;
  currentPageNo = 0;
  private lastSearchedName;

  constructor(private data: DataService, private router: Router) {
  }

  ngOnInit() {
    this.getPatients( false);
  }

  getPatientsWithName() {
    this.getPatients( false);
  }

  getPatients(force) {
    console.log('request sent');
    this.data.getAllPatients(this.getSearchName(), this.count, force)
      .then(r => this.setPatients(r))
      .then(() => {
        this.lastSearchedName = this.getSearchName();
        this.currentPageNo = 0;
      });
  }

  private getSearchName() {
    return this.searchedName || '';
  }

  setPatients(r) {
    this.patients = (r.entry || []).map(p => FlatPatient.fromResource(p.resource as Patient));
    console.log(r);
    const relations = r.link;
    this.nextPage = relations.find(rel => rel.relation === 'next');
    this.previousPage = relations.find(rel => rel.relation === 'previous');
    this.total = r.total;
  }

  onRowClick(row: FlatPatient) {
    this.router.navigate([RoutingConstants.PATIENTS_PAGE, row.id]);
  }

  getNextPage() {
    this.data.get(this.nextPage.url)
      .then(r => this.setPatients(r))
      .then(() => this.currentPageNo++);
  }

  getPreviousPage() {
    this.data.get(this.previousPage.url)
      .then(r => this.setPatients(r))
      .then(() => this.currentPageNo--);
  }
}

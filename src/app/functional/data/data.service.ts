import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment as env} from '../../../environments/environment';
import {FhirClient} from 'ng-fhir/FhirClient';
import Patient = fhir.Patient;
import Bundle = fhir.Bundle;

@Injectable()
export class DataService {
  private readonly client: FhirClient;
  private config: any = {
    baseUrl: env.apiRoot,
    credentials: 'same-origin'
  };
  constructor(private http: HttpClient) {
    this.client = new FhirClient(this.config);
  }

  getAllPatients(name: string, count): Promise<Bundle> {
    return this.withClient(c => c.search({type: 'Patient', query: {name: name, _count: count}}));
  }

  getPatientData(id: string): Promise<Patient> {
      return this.withClient(c => c.read({type: 'Patient', id: id}));
  }

  getPatientMedicationRequests(patientId: string): Promise<Bundle> {
    return this.withClient(c => c.search({type: 'MedicationRequest', query: {patient: patientId, _count: 100}}));
  }

  getPatientObservations(patientId: string): Promise<Bundle> {
    return this.withClient(c => c.search({type: 'Observation', query: {patient: patientId, _count: 100}}));
  }

  withClient(f: (client: FhirClient) => Promise<any>) {
    return f(this.client).then(r => r.data);
  }

  getConsumptionsBetween(devId: string, dateFrom: number, dateTo: number) {
    return this.get(`consumptions/${devId}/${dateFrom}/${dateTo}`);
  }

  get(url) {
    return this.http.get(toApi(url)).toPromise();
  }
  post(url) {
    return this.http.post(toApi(url), {}).toPromise();
  }
}

function toApi(url: string): string {
  return `${env.apiRoot}/${url}/`;
}

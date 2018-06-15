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

  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {
    this.client = new FhirClient(this.config);
  }

  getAllPatients(name: string, count, force: boolean): Promise<Bundle> {
    return this.withClient(c => c.search({type: 'Patient', query: {name: name, _count: count}}),
      `Patients|${name}`, force);
  }

  getPatientData(id: string, force: boolean): Promise<Patient> {
      return this.withClient(c => c.read({type: 'Patient', id: id}),
        `Patient|${id}`);
  }

  getPatientMedicationRequests(patientId: string, count: number, force: boolean): Promise<Bundle> {
    return this.withClient(c => c.search({type: 'MedicationRequest', query: {patient: patientId, _count: count}}),
      `MedReq|${patientId}`, force);
  }

  getPatientObservations(patientId: string, count: number, force: boolean): Promise<Bundle> {
    return this.withClient(c => c.search({type: 'Observation', query: {patient: patientId, _count: count}}),
    `Obs|${patientId}`, force);
  }

  withClient(f: (client: FhirClient) => Promise<any>, key: string = null, force: boolean = true) {
    if (force || key == null || !this.cache.has(key)) {
      return f(this.client)
        .then(r => {
          this.cache.set(key, r);
          return r.data;
        });
    } else {
      return Promise.resolve(this.cache.get(key).data);
    }
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

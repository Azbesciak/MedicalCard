///<reference path="../../../../node_modules/@types/fhir/index.d.ts"/>
import Address = fhir.Address;
import ContactPoint = fhir.ContactPoint;
import HumanName = fhir.HumanName;
import Patient = fhir.Patient;
import PatientCommunication = fhir.PatientCommunication;
import Observation = fhir.Observation;
import ObservationComponent = fhir.ObservationComponent;
import Meta = fhir.Meta;
import CodeableConcept = fhir.CodeableConcept;
import MedicationRequest = fhir.MedicationRequest;

export interface Consumption {
  id: number;
  measure_time: Date;
  value: number;
  device_id: number;
}

export class Granulation {
  constructor(public type: string, public modifier: (val: ChartValue) => ChartValue) {
  }
}

export class Field {
  constructor(public visibleName: string, public fieldName: string) {
  }
}

export class FlatPatient {
  constructor(
    public firstName: string,
    public lastName: string,
    public id: string,
    public gender: string,
    public birthDate: Date,
    public maritalStatus: string,
    public names: HumanName[],
    public telecoms: ContactPoint[],
    public addresses: Address[],
    public communications: PatientCommunication[]) {
  }

  static fromResource(r: Patient): FlatPatient {
    const namePart = r.name.find(n => n.use === 'official');
    return new FlatPatient(namePart.given[0], namePart.family, r.id, r.gender, new Date(r.birthDate),
      r.maritalStatus.text, r.name, r.telecom, r.address, r.communication);
  }

  static getFields(): Field[] {
    return [
      new Field('ID', 'id'),
      new Field('First name', 'firstName'),
      new Field('Last Name', 'lastName'),
      new Field('Gender', 'gender')
    ];
  }
}

export class FlatObservation {
  constructor(public id: string, public code: CodeableConcept, public components: ObservationWithDateComponent[], public issued: Date,
              public effectiveDateTime: Date, public meta: Meta, public status: string) {
  }

  static fromResource(res: Observation): FlatObservation {
    const components = FlatObservation.getComponents(res);
    return new FlatObservation(res.id, res.code, components, new Date(res.issued), new Date(res.effectiveDateTime), res.meta, res.status);
  }

  private static getComponents(res: Observation): ObservationWithDateComponent[] {
    const components = [];
    if (res.valueQuantity) {
      components.push({valueQuantity: res.valueQuantity, code: res.code});
    }
    if (res.component) {
      components.push(...res.component);
    }
    components.forEach(c => c.date = new Date(res.issued))
    return components;
  }
}

export interface ObservationWithDateComponent extends ObservationComponent {
  date: Date;
}

export class FlatMedicationRequest {
  constructor(public id: string, public authoredOn: Date, public description: string,
              public medicationConcept: string, public raw: MedicationRequest) {
  }

  static fromResource(res: MedicationRequest) {
    const desc = this.getDescription(res);
    const med = this.getMedication(res);
    return new FlatMedicationRequest(res.id, new Date(res.authoredOn), desc, med, res);
  }

  static getDescription(res: MedicationRequest) {
    if (res.text != null) {
      return res.text.div;
    }
    if (res.extension == null || res.extension.length === 0) {
      return 'Description not found';
    }
    const desc = res.extension.find(e => !!e.valueCodeableConcept.text);
    if (desc != null) {
      return desc.valueCodeableConcept.text;
    }
    return res.extension[0].valueCodeableConcept.coding[0].display;
  }

  static getMedication(res: MedicationRequest) {
    const med = res.medicationCodeableConcept;
    if (!!med.text) return med.text;
    return med.coding.map(c => c.display).join(', ');
  }
}

export class ChartSeries {
  name: string;
  series: ChartValue[] = [];

  constructor(title, values) {
    this.name = title;
    this.series = values;
  }
}

export class ChartValue {
  constructor(public value: number, public name: Date, public unit: string) {
  }
}

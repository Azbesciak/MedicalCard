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
  constructor(public visibleName: string, public fieldName: string) {}
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
    public communications: PatientCommunication[]) {}
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
  constructor(public id: string, public code: CodeableConcept, public components: ObservationComponent[], public issued: Date,
              public effectiveDateTime: Date, public meta: Meta, public status: string) {}

  static fromResource(res: Observation): FlatObservation {
    const components = FlatObservation.getComponents(res);
    return new FlatObservation(res.id, res.code, components, new Date(res.issued), new Date(res.effectiveDateTime), res.meta, res.status);
  }

  private static getComponents(res: Observation): ObservationComponent[] {
    const components = [];
    if (res.valueQuantity) {
      components.push({valueQuantity: res.valueQuantity, code: res.code});
    }
    if (res.component) {
      components.push(...res.component);
    }
    return components;
  }

}

export class ChartSeries {
  name: string;
  series: ChartValue[] = [];

  constructor(values, granulation: any) {
    this.name = values[0].device_id;
  }
}

export class ChartValue {
  constructor(public value: number, public name: Date) {
  }

  static fromConsumption(c: any) {
    return new ChartValue(c.value, new Date(c.measure_time));
  }

  static fromTime(value: number, name: any) {
    return new ChartValue(value, new Date(name));
  }
}

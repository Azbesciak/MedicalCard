import Bundle = fhir.Bundle;
import BundleLink = fhir.BundleLink;
import {Subject} from 'rxjs';
import {DataService} from '../functional/data/data.service';

export function getNavigation(res: Bundle) {
  const relations = res.link;
  const nextPage = relations.find(rel => rel.relation === 'next');
  const previousPage = relations.find(rel => rel.relation === 'previous');
  return new Links(link(previousPage), link(nextPage));
}

export function getResources(res: Bundle): any[] {
  return (res.entry || []).map(r => r.resource);
}

function link(l: BundleLink) {
  return l != null ? l.url : null;
}

export class Links {
  constructor(public previous: string, public next: string) {
  }
  hasNext() {
    return this.next != null;
  }
}

export async function getAll(o: Bundle, subject: Subject<any[]>, data: DataService,
                             modifier: (a: any) => any = a => a,
                             shouldFetch: (recent: any[]) => boolean = x => true) {
  const result = [];
  let navigation = getNavigation(o);
  let temp = getResources(o).map(modifier);
  result.push(...temp);
  subject.next(result.slice());
  while (navigation.hasNext() && shouldFetch(temp) ) {
    const bundle = await data.get(navigation.next);
    navigation = getNavigation(bundle);
    temp = getResources(o).map(modifier);
    result.push(...temp);
    subject.next(result.slice());
  }
  subject.complete();
}

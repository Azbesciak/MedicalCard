import Bundle = fhir.Bundle;
import BundleLink = fhir.BundleLink;

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

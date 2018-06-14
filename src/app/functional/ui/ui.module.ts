import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material/material.module';
import {HeaderComponent} from './header/header.component';
import {SpacerComponent} from './spacer/spacer.component';
import {KeyValueComponent} from './key-value/key-value.component';
import {TableComponent} from './table/table.component';
import {SectionComponent} from './section/section.component';
import {NotFoundComponent} from './not-found/not-found.component';

const COMPONENTS = [
  HeaderComponent,
  SpacerComponent,
  KeyValueComponent,
  TableComponent,
  SectionComponent,
  NotFoundComponent
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    COMPONENTS
  ],
  declarations: COMPONENTS
})
export class UiModule {
}

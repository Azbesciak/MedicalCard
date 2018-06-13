import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import {FunctionalModule} from '../functional/functional.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  imports: [
    CommonModule,
    FunctionalModule,
    NgxChartsModule
  ],
  exports: [HomeComponent],
  declarations: [
    HomeComponent,
    ChartComponent,
  ]
})
export class MainModule { }

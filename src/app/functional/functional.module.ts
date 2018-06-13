import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UiModule} from './ui/ui.module';
import {FormsModule} from '@angular/forms';
import { MinDirective } from './form-utils/min.directive';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    FormsModule
  ],
  exports: [
    UiModule,
    FormsModule,
    MinDirective
  ],
  declarations: [MinDirective]
})
export class FunctionalModule { }

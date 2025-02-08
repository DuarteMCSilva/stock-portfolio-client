import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { SharedPipesModule } from './pipes/component-pipes.module';

@NgModule({
  declarations: [
  ],
  providers: [
    PercentPipe,
    DecimalPipe,
    CurrencyPipe
  ],
  imports: [
    CommonModule,
    SharedPipesModule
  ],
  exports: [
    CommonModule,
    SharedPipesModule
  ]
})
export class ComponentsSharedModule { }

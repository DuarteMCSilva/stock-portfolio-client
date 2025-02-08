import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe } from '@angular/common';
import { SharedPipesModule } from './pipes/component-pipes.module';

@NgModule({
  declarations: [
  ],
  providers: [
    PercentPipe,
    DecimalPipe
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

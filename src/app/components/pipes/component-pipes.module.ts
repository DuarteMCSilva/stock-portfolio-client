import { NgModule } from '@angular/core';
import { DecimalPipe, CommonModule, PercentPipe } from '@angular/common';
import { ValueFormatterPipe } from './value-formatter/value-formatter.pipe';

@NgModule({
    declarations: [ValueFormatterPipe],
    providers: [
        PercentPipe,
        DecimalPipe
    ],
    exports: [ValueFormatterPipe],
    imports: [CommonModule],
})
export class SharedPipesModule { }

import { DecimalPipe, PercentPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueFormatter',
})
export class ValueFormatterPipe implements PipeTransform {

  readonly defaultDecimal = '1.2-2';

  constructor(
    private percentPipe: PercentPipe,
    private decimalPipe: DecimalPipe
  ){}

  transform(value: string | number, options: any = {}): unknown {

    debugger;

    const isNumber = typeof value === 'number';
    const isString =  typeof value === 'string';
    const isStringOrNumber = isNumber || isString;

    if(!value){
      return 'n.a'
    }

    if(!isStringOrNumber) {
      return value;
    }

    let transformedValue: string | number = value;

    if(isString){
      return value;
    }

    if(isNumber){
      return this.numberFormat(value, options);
    }
    return transformedValue;
  }


  private numberFormat(value: number, options: any) {
    let transformedValue: number | string = value;

    const numberFormat = options.decimalFormat ?? this.defaultDecimal;
    if(options.percentage){
      transformedValue = this.percentPipe.transform(transformedValue, numberFormat) ?? transformedValue;
    } else{
      transformedValue = this.decimalPipe.transform(transformedValue, numberFormat) ?? transformedValue;
    }
    return transformedValue;
  }

}

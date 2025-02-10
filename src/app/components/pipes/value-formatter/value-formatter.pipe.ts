import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueFormatter',
})
export class ValueFormatterPipe implements PipeTransform {

  readonly defaultDecimal = '1.2-2';

  constructor(
    private percentPipe: PercentPipe,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe
  ){}

  transform(value: string | number, options: any = {}): unknown {
    const isNumber = typeof value === 'number';
    const isString =  typeof value === 'string';
    const isStringOrNumber = isNumber || isString;

    if(!value){
      return '-'
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
    const normalizedValues = this.normalizeOrderOfMagnitude(value);
    let transformedValue: number | string = normalizedValues?.value;

    transformedValue = normalizedValues.value;

    const numberFormat = options.decimalFormat ?? this.defaultDecimal;
    if(options.percentage){
      transformedValue = this.percentPipe.transform(transformedValue, numberFormat) ?? transformedValue;
      return transformedValue
    }

    const decimalFormatted = this.decimalPipe.transform(transformedValue, numberFormat) ?? '' + transformedValue;
    transformedValue = decimalFormatted.replace(/\,/g, "");

    if(options.currency) {
      transformedValue = this.currencyPipe.transform(transformedValue) ?? transformedValue;
    }
    return transformedValue + ' ' + normalizedValues.symbol;
  }

  private normalizeOrderOfMagnitude(value: number) {
    const absValue = Math.abs(value);
    if(absValue > 1000000000) {
      const normalized = value/1000000000;
      return { symbol: 'b', value: normalized }
    }
    
    if(absValue > 1000000) {
      const normalized = value/1000000;
      return { symbol: 'M', value: normalized }
    }

    if(absValue > 1000) {
      const normalized = value/1000;
      return { symbol: 'k', value: normalized }
    }
    return {symbol: '', value: value};
  }

}

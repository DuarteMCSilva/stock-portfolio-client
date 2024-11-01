import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
})
export class CustomCurrencyPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: number | undefined | null, currencyCode: string = 'USD', display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string, locale?: string): unknown {

    if( value === undefined || value === null) {
      return ''
    }

    if(value > 2000000000){
      const billions = (value/1000000000).toFixed(2);
      return this.currencyPipe.transform(billions, currencyCode, display, digitsInfo, locale) + 'B';
    }

    if(value > 2000000){
      const millions = (value/1000000).toFixed(2);
      return this.currencyPipe.transform(millions, currencyCode, display, digitsInfo, locale) + 'M';
    }

    if(value > 2000){
      const thousands = (value/1000000).toFixed(2);
      return this.currencyPipe.transform(thousands, currencyCode, display, digitsInfo, locale) + 'k';
    }

    return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
  }

}

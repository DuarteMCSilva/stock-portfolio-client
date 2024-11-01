import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number): unknown {

    if( value === undefined || value === null) {
      return ''
    }

    if(value > 2000000000){
      const billions = (value/1000000000).toFixed(2);
      return billions + 'B';
    }

    if(value > 2000000){
      const millions = (value/1000000).toFixed(2);
      return millions + 'M';
    }

    if(value > 2000){
      const thousands = (value/1000000).toFixed(2);
      return thousands + 'k';
    }
    return value;
  }

}

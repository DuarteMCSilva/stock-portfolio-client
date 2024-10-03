import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  private today: Date;

  constructor() {
    this.today = new Date();
  }

  public getFormattedTodayDate(){
    return this.getYear(this.today)+this.getMonth(this.today)+this.getDay(this.today);
  }

/*   private convertStringToDate(dateYYYYMMDD: string) {
    const day = +dateYYYYMMDD.substring(6,8);
    const month = +dateYYYYMMDD.substring(4,6) - 1;
    const year = +dateYYYYMMDD.substring(0,4); 
    return new Date(day, month, year);
  } */

  private getDay(date: Date) {
    const day = ('0' + date.getDate());
    return day;
  }

  private getYear(date: Date) {
    return date.getFullYear();
  }

  private getMonth(date: Date) {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return month;

  }
}

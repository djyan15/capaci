import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';

@Pipe({
  name: 'tiempo'
})
export class TiempoPipe implements PipeTransform {

  transform(value: any, args?: any): any {


    if (value) {

      // tslint:disable:no-bitwise
      let horas = value / 60 | 0;
      let minutos = value % 60 | 0;

      let minutosR = '';

      if (minutos.toString().length === 1) {
        minutosR = '0' + minutos;
      } else {
        minutosR = minutos.toString();
      }

      if (horas === 1 && minutos === 0) {
        return horas + ':00 ' + 'hr';
      } else if (horas < 1) {
        return '0: ' + minutos + ' mins';
      }
      return horas + ':' + minutosR + ' hrs';
    }

    return 0;
  }
}

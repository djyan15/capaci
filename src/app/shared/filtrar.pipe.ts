import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrar'
})
export class FiltrarPipe implements PipeTransform {

  transform(value: any[], searchText?: any): any {
      if (searchText) {

      return value.filter(v => {
        let data = '';
        // tslint:disable-next-line:forin
        for (let key in v['value']) {
          let elemento = v['value'][key];
            // tslint:disable-next-line:triple-equals
            if (elemento && typeof elemento != 'boolean' && typeof elemento != 'number') {
              data += elemento.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() + ' ';
            }
        }
        return data.includes(searchText.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
      });
    } else {
      return value;
    }
  }
}

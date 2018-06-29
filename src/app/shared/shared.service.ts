import { Injectable } from '@angular/core';
import { IMyDrpOptions } from 'mydaterangepicker';

@Injectable()
export class SharedService {

  meses = { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' };
  mesesArray = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ];
  dias = {su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mié', th: 'Jue', fr: 'Vie', sa: 'Sáb'};

  datePickerOptions: IMyDrpOptions = {
    editableDateRangeField: false,
    monthLabels: this.meses,
    dayLabels: this.dias,
    selectBeginDateTxt: 'Selecciona Fecha Inicio',
    selectEndDateTxt: 'Selecciona Fecha Fin',
    inline: false,
    height: '38px',
    openSelectorOnInputClick: true,
    dateFormat: 'dd.mm.yyyy',
  };

  constructor() { }

}

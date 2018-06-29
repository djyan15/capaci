import { Component, OnInit } from '@angular/core';
import { TallerService } from './taller.service';
import { ITaller } from '../models/taller';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { SharedService } from '../shared/shared.service';
import { IMyDateRangeModel } from 'mydaterangepicker';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

@Component({
  selector: 'app-taller-lista',
  templateUrl: './taller-lista.component.html'
})
export class TallerListaComponent implements OnInit {
  loading = false;
  talleres$: Observable<ITaller[]>;
  busquedaForm: FormGroup;
  vacio = false;

  registros: any[] = [
    {Text: '5', Value: 5},
    {Text: '10', Value: 10},
    {Text: '25', Value: 25},
    {Text: '50', Value: 50},
    {Text: '100', Value: 100},
  ];

  orden: any[] = [
    {Text: 'Más recientes', Value: 1},
    {Text: 'Más antiguos', Value: 0}
  ];

  estados$: Observable<any[]>;

  constructor(public tallerService: TallerService,
              public sharedService: SharedService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.crearFormulario();
    this.getEstados();
    this.getTalleres();
   }

   // Obtiene los estados
   getEstados() {
     this.estados$ = this.tallerService.getEstadosTalleres()
                         .catch(error => this.tallerService.errorHandler(error));
   }

   crearFormulario() {
    this.busquedaForm = this.formBuilder.group({
      myDateRange: [''],
      Taller_Titulo: null,
      Taller_Estado_Numero: 0,
      Orden: 1,
      PageSize: 5
    });
   }

   // Obtiene los talleres
  getTalleres() {
      this.loading = true;
      if (this.tallerService.filtro.Taller_Fecha_Desde !== '') {
        let beginDate = new Date(this.tallerService.filtro.Taller_Fecha_Desde);
        let endDate = new Date(this.tallerService.filtro.Taller_Fecha_Hasta);
        this.busquedaForm.patchValue({
          myDateRange: {
            beginDate: {
              year: beginDate.getFullYear(),
              month: beginDate.getMonth() + 1,
              day: beginDate.getDate()
            },
            endDate: {
              year: endDate.getFullYear(),
              month: endDate.getMonth() + 1,
              day: endDate.getDate()
            }}});
      }

      this.busquedaForm.patchValue({
        Taller_Titulo: this.tallerService.filtro.Taller_Titulo,
        PageSize: this.tallerService.filtro.PageSize,
        Orden: this.tallerService.filtro.orderByDirection0,
        Taller_Estado_Numero: this.tallerService.filtro.Taller_Estado_Numero
      });

    this.talleres$ = this.tallerService.getTalleres(this.tallerService.filtro).do(res => {
      this.loading = false;
      if (res.length > 0) {
        this.tallerService.filtro.Linea = res[0].Linea;
        this.tallerService.filtro.Ultima_Linea = res[res.length - 1].Linea;
        this.tallerService.filtro.Cantidad_Registros = res[0].Cantidad_Registros;
        this.vacio = false;
      } else {
        this.tallerService.filtro.Linea = 0;
        this.tallerService.filtro.Ultima_Linea = 0;
        this.tallerService.filtro.Cantidad_Registros = 0;
        this.vacio = true;
      }

    }).catch(error => { this.loading = false; return this.tallerService.errorHandler(error); });

  }

  // 2Obtiene los datos del formulario de busqueda para realizarla
  buscarTaller() {
    this.tallerService.filtro.Taller_Titulo = this.busquedaForm.value['Taller_Titulo'] || '';
    if (this.busquedaForm.value['myDateRange']) {
      this.tallerService.filtro.Taller_Fecha_Desde = moment(this.busquedaForm.value['myDateRange']['beginJsDate']).format('YYYY/MM/DD');
      this.tallerService.filtro.Taller_Fecha_Hasta = moment(this.busquedaForm.value['myDateRange']['endJsDate']).format('YYYY/MM/DD');
    } else {
      this.tallerService.filtro.Taller_Fecha_Desde = '';
      this.tallerService.filtro.Taller_Fecha_Hasta = '';
    }

    this.tallerService.filtro.orderByDirection0 = this.busquedaForm.value['Orden'];
    this.tallerService.filtro.PageSize = +this.busquedaForm.value['PageSize'];
    this.tallerService.filtro.Taller_Estado_Numero = +this.busquedaForm.value['Taller_Estado_Numero'];

    this.getTalleres();
  }

// Realiza busqueda cuando se filtra por cantidad de páginas o ascendente y descendente
  filtrarPorOrden() {
    this.tallerService.filtro.PageIndex = 1;
    this.buscarTaller();
  }

// Realiza busqueda cuando se elige el rango de fechas
onDateRangeChanged(event: IMyDateRangeModel) {
  if (event['beginJsDate']) {
    this.tallerService.filtro.Taller_Fecha_Desde = moment(event['beginJsDate']).format('YYYY/MM/DD');
    this.tallerService.filtro.Taller_Fecha_Hasta = moment(event['endJsDate']).format('YYYY/MM/DD');
  } else {
    this.tallerService.filtro.Taller_Fecha_Desde = '';
    this.tallerService.filtro.Taller_Fecha_Hasta = '';
  }
  this.tallerService.filtro.PageIndex = 1;
  this.getTalleres();
}

// Reseta el formulario de busqueda y realiza llamada con el filtro por defecto
resetBuscar() {
  this.tallerService.resetFiltro();
  this.crearFormulario();
  this.buscarTaller();
}



}

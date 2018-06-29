// import { IMyDrpOptions, IMyDateRangeModel } from 'mydaterangepicker';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Component, OnInit } from '@angular/core';
import { TemasService } from './temas.service';
import { ITema } from '../models/tema';
import { Router } from '@angular/router';
import * as toastr from 'toastr';
@Component({
  selector: 'app-temas-lista',
  templateUrl: './temas-lista.component.html',
})
export class TemasListaComponent implements OnInit {
  // Declaracion de variable que se usa para poner el Spinner de cargando en el html
  loading = false;
  // Variable que se usa para mostrar cuando no hay registro
  vacio = false;
  // Declaracion de Observable que guarda los temas cargados de la base de datos
  temas$: Observable<ITema[]>;
  // Declaracion de formulario de busqueda
  busquedaForm: FormGroup;
  // Arreglo que contiene los valores para paginar los temas en el html
  registros: any[] = [
    { Text: '5', Value: 5 },
    { Text: '10', Value: 10 },
    { Text: '25', Value: 25 },
    { Text: '50', Value: 50 },
    { Text: '100', Value: 100 },
  ];

  // Arreglo que contiene el orden de los temas
  orden: any[] = [{ Text: 'Más recientes', Value: 1 }, { Text: 'Más antiguos', Value: 0 }];

  // Objeto que contiene la informacion que se filtrara

  constructor(public temaservices: TemasService, public router: Router, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.crearFormulario();
    this.getTemas();
    // this.vacio = false;   
  }

  // Inicializacion del formulario de filtración
  crearFormulario() {
    this.busquedaForm = this.formBuilder.group({
      Tema_Titulo: null,
      Orden: 1,
      PageSize: 5,
    });
  }
  // Carga los temas desde el servicio y lo aloja en una observable donde esos valores se cargan en el html
  getTemas() {
    this.loading = true;
    this.busquedaForm.patchValue({
      Tema_Titulo: this.temaservices.filtro.Tema_Titulo,
      Orden: this.temaservices.filtro.orderByDirection0,
      PageSize: this.temaservices.filtro.PageSize
    });


    this.temas$ = this.temaservices
      .cargarTemas(this.temaservices.filtro)
      .do(res => {
        this.loading = false;

        if (res.length > 0) {
          this.temaservices.filtro.Linea = res[0].Linea;
          this.temaservices.filtro.Ultima_Linea = res[res.length - 1].Linea;
          this.temaservices.filtro.Cantidad_Registros = res[0].Cantidad_Registros;
          this.vacio = false;
        } else {
          this.temaservices.filtro.Linea = 0;
          this.temaservices.filtro.Ultima_Linea = 0;
          this.temaservices.filtro.Cantidad_Registros = 0;
          this.vacio = true;
        }
      })
      .catch(error => {
        toastr.error('No se pudo cargar la lista de temas', 'Error');
        this.loading = false;
        return Observable.bind(null);
      });
  }

  /* Metodo de buscar temas de acuerdo al titulo y lo ordena ya sea de forma ascendente o descendente y el total de registros
  a mostrar
  */
  buscarTemas() {

    this.temaservices.filtro.Tema_Titulo = this.busquedaForm.value['Tema_Titulo'] || '';

    this.temaservices.filtro.orderByDirection0 = this.busquedaForm.value['Orden'];
    this.temaservices.filtro.PageSize = +this.busquedaForm.value['PageSize'];

    this.getTemas();
    return;
  }

  //
  filtrarPorOrden() {
    this.temaservices.filtro.PageIndex = 1;
    this.buscarTemas();
  }
  // Metodo para resetear los valores de busqueda
  resetBuscar() {
    this.temaservices.resetFiltro();

    this.crearFormulario();
    this.buscarTemas();
  }
}

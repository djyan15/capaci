import { ITema } from './../models/tema';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import { APIURL } from '../shared/url';

@Injectable()
export class TemasService {

  filtro: ITema = {
    PageIndex: 1,
    PageSize: 5,
    Linea: 0,
    Ultima_Linea: 0,
    Cantidad_Registros: 0,
    Tema_Titulo: '',
    Tema_Descripcion: '',
    Tema_Duracion_Minutos: 0,
    orderByDirection0: 1,
  };

  constructor(private http: HttpClient) {}
  // Variable usada para almacenar los temas para hacer las operaciones de insertar, elimianr, actualizar y listarlos
  tema: ITema;
  // Metodo para conectar con el api y traer los temas que contiene la base de datos
  cargarTemas(t: ITema): Observable<any> {
    let urlConsulta = APIURL.tema.consulta;
    let url =
      '?PageIndex=' +
      t.PageIndex +
      '&PageSize=' +
      t.PageSize +
      '&orderBy0=' +
      'Tema_Numero' +
      '&orderByDirection0=' +
      t['orderByDirection0'] +
      '&Tema_Numero=' +
      0 +
      '&Tema_Titulo=' +
      t['Tema_Titulo'];
        // tslint:disable-next-line:no-debugger
    return this.http.get(urlConsulta + url);

  }
  // Metodo para conectarse con el API y cargar un tema en especifico por el Tema_Numero
  cargarTemasId(id: number): Observable<any> {

    return this.http.get<ITema>(APIURL.tema.temaId + id).map(data => {

      this.tema = data;
      return data;
    });
  }
  // Metodo para conectarse con el API y insertar los valores que vengan del componente de Crear temas en la base de datos
  insertarTemas(tema: ITema) {
    let headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(APIURL.tema.insertar, tema, { headers: headerOptions });
  }
  // Metodo para conectarse con el API y actualizar los valores que vengan del componente de Crear temas en la base de datos
  editTemas(id: number, tema: ITema) {
    let headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(APIURL.tema.editar + id, tema, { headers: headerOptions });
  }
  // Metodo para conectarse con el API y borrar de la lista los valores que vengan del componente de Crear temas en la base de datos

  borrarTemas(id: number) {
    let headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(APIURL.tema.borrar + id, { headers: headerOptions });
  }

  resetFiltro(): any {
    this.filtro = {
      PageIndex: 1,
      PageSize: 5,
      Linea: 0,
      Ultima_Linea: 0,
      Cantidad_Registros: 0,
      Tema_Titulo: '',
      Tema_Descripcion: '',
      Tema_Duracion_Minutos: 0,
      orderByDirection0: 1,
    };
  }
}

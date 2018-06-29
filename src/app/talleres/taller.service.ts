
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { ITaller, IestadoTaller } from './../models/taller';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ITema } from '../models/tema';
import * as toastr from 'toastr';
import { APIURL } from '../shared/url';

@Injectable()
export class TallerService {
   urlTiposUsuarios = 'http://localhost:51735/Taller/GetTiposUsuarios';

  filtro: ITaller = {
    PageIndex: 1,
    PageSize: 5,
    Linea: 0,
    Ultima_Linea: 0,
    Cantidad_Registros: 0,
    Taller_Titulo: '',
    Taller_Fecha_Desde: '',
    Taller_Fecha_Hasta: '',
    Taller_Estado_Numero: 1,
    orderByDirection0: 1
  };

  constructor(private http: HttpClient) { }
  taller: ITaller;
  temas: ITema;
  estado: IestadoTaller;


  // Método para obtener los temas
  getTemas(id: number): Observable<any> {
    return this.http
   .get<ITaller>(APIURL.taller.temas + id)
   .map(data => {
      this.temas = data;
     return data;
   });

  }

  // Método para obtener un Taller mediante un id
  getTallerId(id: number): Observable<any> {
    return this.http
   .get<ITaller>(APIURL.taller.tallerID + id)
   .map(data => {
      this.taller = data;
     return data;
   });

  }
  // Método para obtener los talleres de forma paginada
  getTalleres(p: ITaller): Observable<any> {
    let url = '?pageIndex=' + p.PageIndex +
              '&pageSize=' + p.PageSize +
              '&Taller_Titulo=' + p['Taller_Titulo'] +
              '&Taller_Estado_Numero=' + p['Taller_Estado_Numero'] +
              '&Taller_Fecha_Desde=' + p['Taller_Fecha_Desde'] +
              '&Taller_Fecha_Hasta=' + p['Taller_Fecha_Hasta'] +
              '&orderByDirection0=' + p['orderByDirection0'];
    return this.http.get(APIURL.taller.consulta + url);
  }

  // Método para insertar un taller
  setTaller(taller: ITaller ): Observable<any> {
    let body = JSON.stringify(taller);
     let headerOptions = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(APIURL.taller.insertar, body, {headers: headerOptions});
  }

  // Método para editar un taller
  EditTaller(taller: ITaller): Observable<any> {
    let body = JSON.stringify(taller);
    let headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(APIURL.taller.editar, body, { headers: headerOptions });
  }

  CancelaTaller(taller: ITaller): Observable<any> {
    let body = JSON.stringify(taller);
    let headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(APIURL.taller.cancelar, body, { headers: headerOptions });
  }

  getEstadosTalleres(): Observable<any> {
    return this.http.get(APIURL.taller.estados);
  } 
  getTiposUsuarios(): Observable<any> {
    return this.http.get(this.urlTiposUsuarios);
  }

  resetFiltro() {
    this.filtro = {
      PageIndex: 1,
      PageSize: 5,
      Linea: 0,
      Ultima_Linea: 0,
      Cantidad_Registros: 0,
      Taller_Titulo: '',
      Taller_Fecha_Desde: '',
      Taller_Fecha_Hasta: '',
      Taller_Estado_Numero: 1,
      orderByDirection0: 1
    };
  }

  errorHandler(error: any) {
    if (error.error.Message.indexOf('Exception') >= 0 ) {
      toastr.error('No se pudo cargar la lista de talleres', 'Error');
    } else {
      toastr.error(error.error['Message'], 'Error');
    }

    return Observable.bind(null);
  }


}

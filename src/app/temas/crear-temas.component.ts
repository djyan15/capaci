import { ITema } from './../models/tema';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { TemasService } from './temas.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as toastr from 'toastr';
import * as moment from 'moment';
import { IMaterial } from '../models/taller';
@Component({
  selector: 'app-temas',
  templateUrl: './crear-temas.component.html',
})
export class TemasComponent implements OnInit {
  public titulo = 'Crear Tema';
  public crearTemas: FormGroup;

  public horas = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public minutos = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  // Variable usada para capturar el valor del parametro de la url
  Tema_Numero: number;
  // Variable usada para saber cuando hay registro en el formulario si se puede eliminar o no
  edit = false;
  //  Variable usada para almacenar los temas que se guardaran en la base de datos
  tema: ITema;
  materiales: any = [];
  // para la duracion
  public DuracionHoras = 0;
  constructor(
    public temaService: TemasService,
    public activedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public router: Router
  ) {
    // Se captura el parametro que venga en el url para saber si es una operacion de editar o guardar (si viene 0 guardar si es mayor a 0 editar)
    this.activedRoute.params.subscribe(params => {
      this.Tema_Numero = +params['id'];

      if (this.Tema_Numero !== 0) {
        this.titulo = 'Editar Tema';
        this.temaService.cargarTemasId(this.Tema_Numero).subscribe(res => {
          this.tema = res as ITema;
          this.edit = true;
          let Duracion = '00.00';
          let nHoras = [];
          let nMinutos = [];
          if (this.tema[0] && this.tema[0].Tema_Duracion_Minutos) {
            Duracion = this.MinutosHoras(this.tema[0].Tema_Duracion_Minutos);
            nHoras = Duracion.split(':');
          }

          this.crearTemas.patchValue({
            Tema_Titulo: this.tema[0].Tema_Titulo,
            Tema_Descripcion: this.tema[0].Tema_Descripcion,
            Temas_Duracion_Horas: nHoras[0],
            Temas_Duracion_Min: nHoras[1],
          });
        });
      }
    });
  }
  igual() {}
  ngOnInit() {
    this.igual();
    this.crearFormulario();
  }
  // Se inicicaliza el formulario de registro de temas;
  crearFormulario() {
    this.crearTemas = this.formBuilder.group({
      Tema_Titulo: ['', [Validators.required, Validators.minLength(5)]],
      Tema_Descripcion: ['', [Validators.required, Validators.minLength(5)]],
      Material: this.formBuilder.array([]),
      Tema_Duracion_Minutos: [],

      Temas_Duracion_Horas: ['00'],
      Temas_Duracion_Min: ['00'],
    });
  }
  CreateMaterial(Recurso_Nombre, Recurso_Archivo_Nombre): FormGroup {
    return this.formBuilder.group({
      Recurso_Nombre: Recurso_Nombre,
      Recurso_Archivo_Nombre: Recurso_Archivo_Nombre,
    });
  }
  AdjuntarMaterial(material: IMaterial) {
    let formArray: FormArray = this.crearTemas.get('Material') as FormArray;
    formArray.push(this.CreateMaterial(material.Recurso_Nombre, material.Recurso_Archivo_Nombre));
    this.materiales.push(material);
  }

  DeslistarMaterial(material: FormGroup, index: number) {
    let array = this.crearTemas.get('Material') as FormArray;
    array.removeAt(index);

  }
  novacia(control: FormControl): { [s: string]: boolean } {
    let forma: any = this;
    if (control.value === '00:00') {
      return {
        horaValida: true,
      };
    }
    return null;
  }

  // Metodo para guardar los temas ya sea para insertar o actualizar
  GuardarTemas(form: FormGroup) {
    let minutos = this.HorasAMinutos(
      this.crearTemas.controls.Temas_Duracion_Horas.value + ':' + this.crearTemas.controls.Temas_Duracion_Min.value
    );

    let params = {
      Tema_Numero: this.Tema_Numero,
      Tema_Titulo: form.value['Tema_Titulo'],
      Tema_Descripcion: form.value['Tema_Descripcion'],
      Tema_Duracion_Minutos: minutos,
      Registro_Usuario: 'Bladimir Rosario',
    };

    // Si viene 0 indica que se va a insertar un nuevo tema
    if (this.Tema_Numero === 0) {
      this.temaService.insertarTemas(params).subscribe(resp => {
        toastr.success('Se guardó el tema correctamente', 'Guardado');
        setTimeout(() => {
          this.regresar();
          this.edit = false;
        }, 2000);
      });
      // si viene otro valor diferente entonces actualizara
    } else if (this.Tema_Numero > 0) {
      this.temaService.editTemas(this.Tema_Numero, params).subscribe(resp => {
        toastr.success('Se guardó el tema correctamente', 'Guardado');
        setTimeout(() => {
          this.regresar();
          this.edit = false;
        }, 2000);
      });
    }
  }
  // Elimina los temas de la lista
  borrarTema() {
    let id = this.Tema_Numero;
    this.temaService.borrarTemas(id).subscribe(resp => {
      toastr.success('Se eliminó el tema correctamente', 'Guardado');
      this.regresar();
      this.edit = false;
    });
  }

  HorasAMinutos(hora: string) {
    let parts = hora.split(':');
    let total = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);

    let resultado = total;
    return resultado;
  }
  MinutosHoras(minutos: number) {
    // tslint:disable:no-bitwise
    let h = (minutos / 60) | 0,
      m = minutos % 60 | 0;
    let resultado = moment
      .utc()
      .hours(h)
      .minutes(m)
      .format('HH:mm');
    console.log(resultado);
    return resultado;
  }
  regresar() {
    window.history.back();
  }
}

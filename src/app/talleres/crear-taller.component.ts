import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TallerService } from './taller.service';
import { ITaller, IestadoTaller, ITiposUsuarios, IMaterial } from '../models/taller';
import { FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { TemasService } from '../temas/temas.service';
import { ITema } from '../models/tema';
import { Observable } from 'rxjs/Observable';
import { INgxMyDpOptions } from 'ngx-mydatepicker';
import * as toastr from 'toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { debug, log } from 'util';

@Component({
  selector: 'app-crear-taller',
  templateUrl: './crear-taller.component.html'
})
export class CrearTallerComponent implements OnInit {
  
 public archivo: File; 
  public titulo = 'Crear Taller';
  public crearTaller: FormGroup;
  public formCancelarTaller: FormGroup;
  public Temas_checked: Boolean = false;
  public Refrigerio_checked: Boolean = true;
  public Stiempo = '';
  public Taller_Numero;
  public SDuracionMinutos = '';
  public estadoDelTaller = '';
  public estado: IestadoTaller;
  public TallerCancelado = false;
  public TiposUsuarios$: ITiposUsuarios[] = [];
  private Temas_seleccionadosControl = [];
  private Taller: ITaller[];
  private taller: ITaller;
  private DuracionMinutos = 0;
  private temas_consulta: ITema[] = [];
  temas: any = [];
  materiales: any = [];
  public horas = [ '00', '01', '02', '03', '04', '05', '06', '07' , '08' , '09' , '10' , '11', '12'];
  public minutos = ['00', '05', '10', '15', '20' , '25' , '30' , '35', '40' , '45' , '50' , '55'];



  // Optiones para el Date Picker(Formato)
  myOptions: INgxMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    showTodayBtn: false,
    disableUntil: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate() - 1
    }
  };

  constructor(public tallerService: TallerService,
    private fb: FormBuilder,
    public _TemasService: TemasService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
   
    // Metodo para cargar un Taller previamente creado en el formulario de creación de un taller
    this.activatedRoute.params.subscribe(params => {
      
      this.Taller_Numero = +params['id'];

      // Si en la ruta hay un numero mayor que 0, significa que es la informacion de un taller que se va a cargar.
      if (this.Taller_Numero !== 0) {


        this.tallerService.getTallerId(this.Taller_Numero).subscribe(res => {
          if (res) {
            this.taller = res[0] as ITaller;

          }

          let Duracion = '00.00';
          let Duracion_refrigerio = '00.00';
          let nHoras = [];
          let nMinutos = [];
          if (this.taller && this.taller.Taller_Duracion_Minutos) {
            Duracion = this.MinutosHoras(this.taller.Taller_Duracion_Minutos);
            nHoras = Duracion.split(':');
          }
          if (this.taller && this.taller.Taller_Duracion_Minutos_Refrigerio) {
            Duracion_refrigerio = this.MinutosHoras( +this.taller.Taller_Duracion_Minutos_Refrigerio );
            nMinutos = Duracion_refrigerio.split(':');
          }
          if (this.taller.Taller_Estado_Numero === 4) {
            this.TallerCancelado = true;
            this.crearTaller.get('Taller_Hora_Inicio').disable();
          }
          // Asigancion de los valores desde la base de datos a los campos correspondientes
          this.crearTaller.patchValue({
            Temas_checked: false,
            Taller_Fecha_Inicio: {
              date: {
                year: +this.taller.Taller_Fecha_Inicio.toString().substring(6, 10),
                month: +this.taller.Taller_Fecha_Inicio.toString().substring(3, 5),
                day: +this.taller.Taller_Fecha_Inicio.toString().substring(0, 2)
              }
            },
            Taller_Titulo: this.taller.Taller_Titulo,
            Taller_Descripcion: this.taller.Taller_Descripcion,
            Taller_Cupos_Disponibles: this.taller.Taller_Cupos_Disponibles,
            Taller_Duracion_Horas: nHoras[0],
            Taller_Duracion_Min: nHoras[1],
            Taller_Duracion_Horas_Refrigerio: nMinutos[0],
            Taller_Duracion_Min_Refrigerio: nMinutos[1],
            Taller_Hora_Inicio: this.taller.Taller_Hora_Inicio,
            Taller_Ubicacion: this.taller.Taller_Ubicacion,
            Taller_Ubicacion_Local: this.taller.Taller_Ubicacion_Local,
            Usuario_Tipo_Numero: this.taller.Usuario_Tipo_Numero
          });

          if (+this.taller.Taller_Fecha_Inicio.toString().substring(6, 10) === 1900) {
            this.crearTaller.patchValue({
              Taller_Fecha_Inicio: null
            });
          }
          this.SumarTiempos(this.taller.Taller_Duracion_Minutos, this.taller.Taller_Duracion_Minutos_Refrigerio);
        });
      }

    });

  }

  // Opciones para el procedimiento de paginacion y Filtros
  filtro: ITema = {
    PageIndex: 1,
    PageSize: 1000,
    Linea: 0,
    Ultima_Linea: 0,
    Cantidad_Registros: 11,
    Tema_Titulo: '',
    Tema_Descripcion: '',
    Tema_Duracion_Minutos: 0,
    orderByDirection0: 0,
  };

  ngOnInit() {
    
    // Al entrar a la pagina de creacion de taller se inician de forma automatica estos métodos.
    this._TemasService.cargarTemas(this.filtro); // Filtro de temas, para la opcion de multiples temas

    // Metodo para asignar a  una variable los temas que tiene asignado previamente
    if (this.Taller_Numero > 0) {
      this.titulo = 'Detalle del taller';
      this.tallerService.getTemas(this.Taller_Numero).subscribe(temas => {
        this.temas_consulta = temas as ITema[];
        if (this.temas_consulta.length > 0) {
          this.crearTaller.patchValue({
            Temas_checked: true
          });
        }
        this.temas_consulta.forEach(element => {
          this.DuracionMinutos += element.Tema_Duracion_Minutos;
          this.SDuracionMinutos = this.MinutosHoras(this.DuracionMinutos);
        });
      });
    }


    this.crearForm(); // Inicializacion del formulario
    this.getTemas(); // Método para obtener temas
    this.formCancelarTaller = this.fb.group({
      Taller_Cancelacion_Motivo: [null, Validators.required],
    });
  }


  // Creación del formulario y sus validaciones
  crearForm() {
    this.crearTaller = this.fb.group({
      Taller_Titulo: ['', Validators.required],
      Taller_Descripcion: ['', Validators.required],
      Temas: this.fb.array([]),
      Material: this.fb.array([]),
      Taller_Fecha_Inicio: [null],
      Taller_Cupos_Disponibles: [1, [Validators.required, Validators.pattern('^[0-9]{1,}'), Validators.min(1)]],
      Taller_Hora_Inicio: [null],
      Taller_Ubicacion: ['Av. 27 de Febrero # 261, Ensanche Piantini, Edificio SISALRIL', Validators.required],
      Busqueda_Temas: [null],
      Temas_checked: [false],
      Refrigerio_checked: [false],
      Taller_Ubicacion_Local: 0,
      Usuario_Tipo_Numero: 0,
      Taller_Duracion_Horas: ['00'],
      Taller_Duracion_Min: ['00'],
      Taller_Duracion_Horas_Refrigerio: ['00'],
      Taller_Duracion_Min_Refrigerio: ['00']
    });
    this.TiposUsuarios();
  }
  TiposUsuarios() {
    // this.TiposUsuarios$ = this.tallerService.getTiposUsuarios().catch(error => this.tallerService.errorHandler(error));
    this.tallerService.getTiposUsuarios().subscribe(data => {
      this.TiposUsuarios$ = data;
    });
  }
  // Validacion de los campos time de duracion, no puede ser 00:00
  HorasEn0(control: AbstractControl): { [s: string]: boolean } {
    if (control.value === '00:00') {
      return {
        noiguales: true,
      };
    }
    return null;
  }

  // Método para Crear los temas para el  FormBuilder
  createItem(Value, Tema_Numero, Tema_Titulo, Tema_Duracion_Minutos): FormGroup {
    return this.fb.group({
      Value: Value,
      Tema_Numero: Tema_Numero,
      Tema_Titulo: Tema_Titulo,
      Tema_Duracion_Minutos: Tema_Duracion_Minutos
    });
  }
  CreateMaterial(Recurso_Nombre, Recurso_Archivo_Nombre, Recurso): FormGroup {
    return this.fb.group({
      Recurso_Nombre: Recurso_Nombre,
      Recurso_Archivo_Nombre: Recurso_Archivo_Nombre,
      Recurso: Recurso
    });

  }

  // Método para agregar los items creados para el array de Temas del FormBuilder
  AgregarTemas(tema: FormGroup): void {
    if (this.Temas_seleccionadosControl.some(t => t.Tema_Numero === tema.value.Tema_Numero)) {
      this.Temas_seleccionadosControl.splice(this.Temas_seleccionadosControl.indexOf(tema.value), 1);

      this.DuracionMinutos -= tema.value.Tema_Duracion_Minutos;
      this.SDuracionMinutos = this.MinutosHoras(this.DuracionMinutos);
    } else {
      this.Temas_seleccionadosControl.push(tema.value);
      this.DuracionMinutos += tema.value.Tema_Duracion_Minutos;
      this.SDuracionMinutos = this.MinutosHoras(this.DuracionMinutos);
    }
    this.temas = this.crearTaller.value['Temas'] as FormArray;
  }

  // Método para quitar de la lista de temas deseados, los temas que no queremos que sean añadidos
  DeslistarTemas(tema: FormGroup) {
    this.DuracionMinutos -= tema.value.Tema_Duracion_Minutos;
    this.SDuracionMinutos = this.MinutosHoras(this.DuracionMinutos);
    tema.patchValue({ Value: 0 });
    this.Temas_seleccionadosControl.pop();
  }
  
  AdjuntarMaterial(material: any) {
    let formArray: FormArray = this.crearTaller.get('Material') as FormArray;
    formArray.push(this.CreateMaterial( material.Recurso_Nombre, material.Recurso_Archivo_Nombre, material.Recurso));
    
  }

  DeslistarMaterial(material: FormGroup , index: number) {
      let array = this.crearTaller.get('Material') as FormArray;
      array.removeAt(index);
      console.log(this.materiales);
  }

  // Método para obtener los temas, este metodo llama al servicio de "TemasService"
  getTemas() {
    this._TemasService.cargarTemas(this.filtro).subscribe(res => {
      this.filtro.Cantidad_Registros = res[0].Cantidad_Registros;
      let temas: any[] = res as any[];
      temas.forEach(element => {
        let formArray: FormArray = this.crearTaller.get('Temas') as FormArray;
        let value = false;
        if (this.temas_consulta.some(t => t.Tema_Numero === element.Tema_Numero)) {
          value = true;
          this.Temas_seleccionadosControl.push(element);
        }
        formArray.push(this.createItem(value, element.Tema_Numero, element.Tema_Titulo, element.Tema_Duracion_Minutos));
      });
    });
  }

  // Metodo para filtrar temas en la barra del buscador
  buscarTemas() {
    this.filtro.Tema_Titulo = this.crearTaller.controls.Busqueda_Temas.value;
    this.getTemas();
  }

  // Método para que se muestren los temas para seleccionar cuando la opcion "Temas multiples" esté activa
  Mostrar() {
    this.crearTaller.patchValue({ Temas_checked: true });
  }
  // Metodo para ocultar los temas cuando la opcion "Temas multiples" esté inactiva
  Ocultar() {
    this.Temas_checked = false;
  }

  // Método para Limpiar el campo de lugar cuando la opcion "Exterior" este activa
  DireccionLocal() {
    this.crearTaller.patchValue({ Taller_Ubicacion: 'Av. 27 de Febrero # 261, Ensanche Piantini, Edificio SISALRIL' });
  }

  DireccionExterna() {
    this.crearTaller.patchValue({ Taller_Ubicacion: '' });
  }

  // Método para Desactivar y activar el campo de refrigerio, cuando la opcion "Incluir tiempo de rerigerio" esté activa o inactiva
  MostrarRefrigerio() {
    if (!this.crearTaller.controls.Refrigerio_checked.value) {
      this.crearTaller.controls.Taller_Duracion_Minutos_Refrigerio.enable();
    } else {
      this.crearTaller.controls.Taller_Duracion_Minutos_Refrigerio.disable();
    }
  }



  // Método para crear o actualizar un taller dependiendo las condiciones
  SetTaller(taller: FormGroup) {
    // Asignacion de variables y conversiones de datos para realizar la insercion o edición de un taller
    let temas = this.crearTaller.controls.Temas.value as any[];
    let materiales = this.crearTaller.controls.Material.value as any[];
    let temasSeleccionados = temas.filter(t => t.Value === true); // Buscar los temas seleccionados, mediante su propiedad "Value" creada con el metodo "CrearItem" y "AgregarTemas"
    let fecha = '';
    if (this.crearTaller.value.Taller_Fecha_Inicio) {
      let date = this.crearTaller.value.Taller_Fecha_Inicio.date;
      fecha = moment(new Date(date.year, date.month - 1, date.day)).format('MM-DD-YYYY');
    }
    let minutos = this.HorasAMinutos(this.crearTaller.controls.Taller_Duracion_Horas.value + ':' + this.crearTaller.controls.Taller_Duracion_Min.value);
    let minutos_refrigerio = this.HorasAMinutos(this.crearTaller.controls.Taller_Duracion_Horas_Refrigerio.value + ':' + this.crearTaller.controls.Taller_Duracion_Min_Refrigerio.value);

    let params = this.crearTaller.value;
    params.Taller_Duracion_Minutos = minutos;
    params.Taller_Duracion_Minutos_Refrigerio = minutos_refrigerio || 0;
    params.Temas = temasSeleccionados;
    params.Taller_Fecha_Inicio = fecha;
    params.Taller_numero = this.Taller_Numero;
    params.Registro_Usuario = 'R.peguero';
    params.Taller_Hora_Inicio = params.Taller_Hora_Inicio || '';
    params.Material =  materiales;

    if (this.Taller_Numero > 0) { // Validacion para diferencias una Inserció0 de una Edición, si Taller numero es mayor que 0, es una Edicion, de lo contrario es una inserción

      if (!this.crearTaller.value.Temas_checked) { // Validar si la opcion de "Temas multiples" está activa
        this.tallerService.EditTaller(params).subscribe(() => {
          toastr.success('Se ha editado el taller satisfactóriamente', 'Guardado');
          setTimeout(() => {
            this.regresar();
          }, 2000);
        });

      } else {
        if (temasSeleccionados.length > 0) { // Validar cuando la opcion "Temas multiples" está activa y no hay temas seleccionados, si no los hay arrojará una alerta
          this.tallerService.EditTaller(params).subscribe(() => {
            toastr.success('Se ha editado el taller satisfactóriamente', 'Guardado');
            setTimeout(() => {
              this.regresar();
            }, 2000);
          });
        } else {
          toastr.warning('Debes seleccionar un tema', 'Aviso');
        }
      }

    } else {

      if (!this.crearTaller.value.Temas_checked) { // Validar si la opcion de "Temas multiples" está activa
        this.tallerService.setTaller(params).subscribe(res => {
          toastr.success('Se ha creado el taller satisfactóriamente', 'Guardado');
          setTimeout(() => {
            this.regresar();
          }, 2000);
        });
      } else {
        if (temasSeleccionados.length > 0) { // Validar cuando la opcion "Temas multiples" está activa y no hay temas seleccionados, si no los hay arrojará una alerta
          this.tallerService.setTaller(params).subscribe(res => {
            toastr.success('Se ha creado el taller satisfactóriamente', 'Guardado');
            setTimeout(() => {
              this.regresar();
            }, 2000);
          });
        } else {
          toastr.warning('Si tienes la opción de "Elegir múltiples temas" activa, Debes seleccionar un tema', 'Aviso');
        }
      }
    }
  }

  // Método para Convertir Horas a minutos
  HorasAMinutos(hora: string) {

    let parts = hora.split(':');
    let total = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);

    let resultado = total;
    return resultado;
  }

  // Método para Convertir minutos a horas
  MinutosHoras(minutos: number) {
    // tslint:disable:no-bitwise
    let h = minutos / 60 | 0,
      m = minutos % 60 | 0;
    let resultado = moment.utc().hours(h).minutes(m).format('HH:mm');
    return resultado;
  }

  // Metodo para leer el archivo que se quiere adjuntar al taller
  onFileChange(event) {
    debugger;

    let file = event.target.files[0];
    this.archivo = file;
    let reader = new FileReader();
    this.crearTaller.patchValue({ Material: [ {Recurso_Archivo_Nombre: file.name }, {Recurso_Nombre: this.crearTaller.get('Material').get('Recurso_Nombre')}, {Recurso: file.name }  ] });
  }

  cancelarTaller() {
    let params = {
      Taller_Numero: this.Taller_Numero,
      Taller_Cancelacion_Motivo: this.formCancelarTaller.value['Taller_Cancelacion_Motivo'],
      Registro_Usuario: 'usuario'
    };

    this.tallerService.CancelaTaller(params).subscribe(result => {
      let tallerCancelado = result as ITaller;
      if (tallerCancelado.Taller_Numero > 0) {
        toastr.success('El taller ha sido cancelado correctamente', 'Cancelado');
        setTimeout(() => {
          this.regresar();
        }, 2000);
      }
    }, error => this.tallerService.errorHandler(error));
  }

  regresar() {
    window.history.back();
  }

  SumarTiempos(value1, value2) {
    this.DuracionMinutos = value1 + value2;
    let resultado = this.MinutosHoras(this.DuracionMinutos);
    this.Stiempo = resultado;
  }

  ConvertirYSumarTiempos(value1, value2) {
    value1 = this.crearTaller.controls.Taller_Duracion_Horas.value + ':' + this.crearTaller.controls.Taller_Duracion_Min.value;
    value2 = this.crearTaller.controls.Taller_Duracion_Horas_Refrigerio.value + ':' + this.crearTaller.controls.Taller_Duracion_Min_Refrigerio.value;
    this.DuracionMinutos = this.HorasAMinutos(value1) + this.HorasAMinutos(value2);
    let resultado = this.MinutosHoras(this.DuracionMinutos);
    this.Stiempo = resultado;
  }
  Algo(hora1, minuto1, hora2, minuto2) {
  let value1 = hora1 + ':' + minuto1;
  let value2 = hora2 + ':' + minuto2;
  this.DuracionMinutos = this.HorasAMinutos(value1) + this.HorasAMinutos(value2);
  let resultado = this.MinutosHoras(this.DuracionMinutos);
  this.Stiempo = resultado;
  }

}

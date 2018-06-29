import { ITema } from './tema';
import { Pipe } from '@angular/core';
export interface ITaller {
    PageIndex?: number;
    PageSize?: number;
    orderBy0?: number;
    orderByDirection0?: number;
    Taller_Numero?: number;
    Taller_Titulo?: string;
    Taller_Descripcion?: string;
    Usuario_Tipo_Numero?: number;
    Taller_Estado_Numero?: number;
    Participantes_Inscritos?: number;
    Taller_Cupos_Disponibles?: number;
    Taller_Duracion_Minutos?: number;
    Taller_Duracion_Minutos_Refrigerio?: string;
    Taller_Hora_Inicio?: number;
    Taller_Fecha_Inicio?: Date;
    Taller_Fecha_Fin?: Date;
    Taller_Fecha_Desde?: string;
    Taller_Fecha_Hasta?: string;
    Taller_Ubicacion?: string;
    Temas?: ITema[];
    Material?: IMaterial[];
    Linea?: number;
    Ultima_Linea?: number;
    Cantidad_Registros?: number;
    Taller_Ubicacion_Local?: string;
}

export interface IestadoTaller {
    Taller_Estado_Numero?: number;
    Taller_Estado_Descripcion?: string;
}

export interface ITiposUsuarios {
    Usuario_Tipo_Numero?: number;
    Usuario_Tipo_Descripcion?: string;
    Usuario_Tipo_Publicar?: string;
}

export interface IMaterial {
    Recurso_Numero?: number;
    Taller_Numero?: number;
    Tema_Numero?: number;
    Recurso_Nombre?: string;
    Recurso_Archivo_Nombre?: string;
    Recurso_Tipo_Archivo?: string;
    // Recurso: File;
}

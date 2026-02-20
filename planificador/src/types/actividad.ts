//import type { Subtarea, CrearSubtareaDTO } from './plan';

/*
// TODO: Define los posibles estados de una actividad
export type EstadoActividad = 'pendiente' | 'en_progreso' | 'finalizada';
*/

/*
// TODO: Interfaz que representa una actividad con sus propiedades básicas y plan de trabajo
export interface Actividad {
  id: number;
  titulo: string;
  descripcion?: string;
  fecha_creacion: string; // ISO Date string (YYYY-MM-DD)
  estado: EstadoActividad;
  
  // Relación con subtareas (el backend podría devolverlas anidadas o no)
  plan_trabajo?: Subtarea[];
}
*/

/*
// TODO: DTO para la creación de una nueva actividad incluyendo su plan inicial
export interface CrearActividadDTO {
  titulo: string;
  descripcion?: string;
  // T1: Crear actividad + plan inicial (se envían juntos)
  plan_inicial: CrearSubtareaDTO[];
}
*/

/*
// TODO: DTO para la actualización de los campos de una actividad existente
export interface UpdateActividadDTO {
  titulo?: string;
  descripcion?: string;
  estado?: EstadoActividad;
}
*/

// Para la vista de "Hoy" (T2)
/*
// TODO: DTO que resume el progreso de una actividad para la vista diaria
export interface ResumenProgresoDTO {
    actividad_id: number;
    titulo_actividad: string;
    progreso_porcentaje: number;
    horas_totales_hoy: number;
}
*/

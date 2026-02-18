// Enum para estados de la subtarea (según T4: "hecho/pospuesto")
/*
// TODO: Define los estados posibles para una subtarea
export type EstadoSubtarea = 'pendiente' | 'completada' | 'pospuesta';
*/

/*
// TODO: Interfaz que representa una subtarea individual dentro de un plan
export interface Subtarea {
  id: number;
  actividad_id: number;
  titulo: string;
  fecha_objetivo: string; // ISO Date string (YYYY-MM-DD)
  horas_estimadas: number;
  estado: EstadoSubtarea;
  nota_seguimiento?: string; // Opcional para T4
}
*/

/*
// TODO: DTO para la creación de una nueva subtarea
export interface CrearSubtareaDTO {
  titulo: string;
  fecha_objetivo: string;
  horas_estimadas: number;
}
*/

/*
// TODO: DTO para la actualización parcial de una subtarea existente
export interface ActualizarSubtareaDTO extends Partial<CrearSubtareaDTO> {
  estado?: EstadoSubtarea;
  nota_seguimiento?: string; 
}
*/

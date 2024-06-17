export interface Evento
{
  id?: number;
  nombre?: string;
  fechaRealizacion?: Date | null;
  fechaCierreInscripcion?: Date | null;
  inscripcioneseventos?: any[];
  geolocalizacion?: string;
  descripcion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

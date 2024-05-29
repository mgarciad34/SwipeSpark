export interface Evento
{
  id?: number;
  nombre?: string;
  fechaRealizacion?: Date | null;
  fechaCierreInscripcion?: Date | null;
  geolocalizacion?: string;
  descripcion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Evento
{
  id?: number;
  Nombre?: string;
  FechaRealizacion?: Date | null;
  FechaCierreInscripcion?: Date | null;
  Geolocalizacion?: string;
  Descripcion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

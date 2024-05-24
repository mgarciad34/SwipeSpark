export interface User {
  id?: number;
  Nombre?: string;
  Email?: string;
  Contrasena?: string;
  Nick?: string;
  Estado?: string;
  Foto?: string;
  RolID?: number;
  Amigo_amistades?: any
  amistades?: any
  inscripcioneseventos?: any
  mensajes?: any
  preferencia?: any
  createdAt?: Date;
  updatedAt?: Date;
}

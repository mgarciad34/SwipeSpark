export interface User {
  [key: string]: any;
  id?: number;
  nombre?: string;
  email?: string;
  contrasena?: string;
  nick?: string;
  estado?: string;
  foto?: string;
  rolID?: number;
  amistades?: any
  amigo_amistades?: any
  inscripcioneseventos?: any
  mensajes?: any
  genero?: any
  preferencia?: any
  createdAt?: Date;
  updatedAt?: Date;
}

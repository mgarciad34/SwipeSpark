import { Routes } from '@angular/router';
import { LoginComponent } from './pantallas/login/login.component';
import { RegistroComponent } from './pantallas/registro/registro.component';
import { RecuperarComponent } from './pantallas/recuperar/recuperar.component';

export const routes: Routes = [
  {path: '', component: LoginComponent},  // login
  {path: 'registro', component: RegistroComponent}, // registro
  {path: 'recuperar', component: RecuperarComponent}, // recuperar contraseña
];

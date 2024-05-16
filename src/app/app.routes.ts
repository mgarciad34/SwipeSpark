import { Routes } from '@angular/router';
import { LoginComponent } from './pantallas/login/login.component';
import { RegistroComponent } from './pantallas/registro/registro.component';
import { RecuperarComponent } from './pantallas/recuperar/recuperar.component';
import { InicioComponent } from './pantallas/inicio/inicio.component';
import { InactivoComponent } from './pantallas/inactivo/inactivo.component';
import { stateGuard } from './guards/State.guard';
import { authGuard } from './guards/auth.guard';
import { inactiveGuard } from './guards/inactive.guard';
import { DashboardAdminComponent } from './pantallas/admin/dashboard-admin/dashboard-admin.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent,canActivate:[authGuard]},  // login
  {path: 'registro', component: RegistroComponent,canActivate:[authGuard]}, // registro
  {path: 'recuperar', component: RecuperarComponent,canActivate:[authGuard]}, // recuperar contraseña
  {path: 'inactivo', component: InactivoComponent,canActivate:[inactiveGuard]}, // inactivo
  {path: '', component:InicioComponent,canActivate:[stateGuard]},
  {path: 'admin/dashboard', component: DashboardAdminComponent},
];

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
import { adminGuard } from './guards/admin.guard';
import { SeccionUsuarioComponent } from './pantallas/inicio/seccion-usuario/seccion-usuario.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent,canActivate:[authGuard]},
  {path: 'registro', component: RegistroComponent,canActivate:[authGuard]},
  {path: 'recuperar', component: RecuperarComponent,canActivate:[authGuard]},
  {path: 'inactivo', component: InactivoComponent,canActivate:[inactiveGuard]},
  {path: '',component:InicioComponent,canActivate:[stateGuard],},
  {path: 'admin/dashboard', canActivate:[adminGuard], component: DashboardAdminComponent},
  {path: 'perfil',component: SeccionUsuarioComponent,canActivate:[stateGuard]}
];

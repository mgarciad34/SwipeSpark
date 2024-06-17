import { User } from './../../../models/user';
import { CommonModule } from '@angular/common';
import { PieAdminComponent } from './../pie-admin/pie-admin.component';
import { CabezeraAdminComponent } from './../cabezera-admin/cabezera-admin.component';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { FiltroTextoPipe } from '../../../pipe/filtroTexto.pipe';
import { FormsModule} from '@angular/forms';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';
import { AppComponent } from '../../../app.component';
import { Evento } from '../../../models/eventos';
import { EventosService } from '../../../servicios/eventos.service';
import { ModalEventoComponent } from '../modal-evento/modal-evento.component';
import { ModalCrearEventoComponent } from '../modal-crear-evento/modal-crear-evento.component';
import { LoginService } from '../../../servicios/login.service';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule,PieAdminComponent, CabezeraAdminComponent,FiltroTextoPipe,FormsModule,ModalUsuarioComponent, ModalEventoComponent, ModalCrearEventoComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {
  constructor(private usuariosServicio: UsuariosService, private main: AppComponent, private cdr: ChangeDetectorRef, private eventosServicio: EventosService, private loginService:LoginService, private router: Router) {
    this.obtenerUsuarios();
    this.obtenerEventos();
    this.obtenerUsuario();
  }
  subMenu = signal('eventos')
  usuarioSesion = signal({} as User)
  usuarios = signal<User[]>([])
  eventos = signal<Evento[]>([])
  filter = signal('')
  modalUsuario = signal(false)
  modalEvento = signal(false)
  modalCrearEvento = signal(false)
  usuarioActual = signal<User>({})
  eventoActual = signal<Evento>({})
  clavesExcluidas = ["contrasena", "foto", "createdAt", "updatedAt", "id","amistades","inscripcioneseventos","mensajes","preferencia","amigo_amistades","rol"];
  cambiandoSubMenu(nuevoSubMenu: string) {
    this.subMenu.set(nuevoSubMenu)
  }
  cambiandoValorModal(valor: boolean) {
    this.modalUsuario.set(valor)
  }
  cambiandoValorModalEvento(valor: boolean) {
    this.modalEvento.set(valor)
  }
  cambiandoValorModalEventoCrear(valor: boolean) {
    this.modalCrearEvento.set(valor)
  }

  obtenerUsuario(){
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      this.loginService.obtenerUsuario(user.id).pipe(
        catchError((error) => {
          console.error("error no se pudo obtener el usuario");
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
          return of(null); // Manejar el error retornando un observable vacío o algún valor por defecto
        })
      ).subscribe((res: any) => {
        if (res && res.status === 200) {
          this.usuarioSesion.set(res.body);
        }
      });
    }
  }

  obtenerUsuarios(){
    this.usuariosServicio.obtenerUsuarios().subscribe((response) => {
      if (response.status === 200) {
        this.usuarios.set(response.body)
      }
    })
  }

  obtenerEventos(){
    this.eventosServicio.obtenerEventos().subscribe((response) => {
      if (response.status === 200) {
        this.eventos.set(response.body)
      }
    })
  }

  guardando(valor:boolean){
    this.obtenerEventos();
    this.obtenerUsuarios();
  }


  borrarEvento(id:any){
    this.eventosServicio.eliminarEvento(id).subscribe((response) => {
      if (response.status === 200) {
        this.main.changeModal('success', 'Evento eliminado correctamente')
        this.obtenerEventos();
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      }
      if (response.status === 404) {
        this.main.changeModal('error', 'Evento no encontrado')
      }
      if (response.status === 500) {
        this.main.changeModal('error', 'Error en el servidor')
      }
    });
  }

  borrarUsuario(id:any){
    this.usuariosServicio.eliminarUsuario(id).subscribe((response) => {
      if (response.status === 200) {
        this.main.changeModal('success', 'Usuario eliminado correctamente')
        this.obtenerUsuarios();
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      }
      if (response.status === 404) {
        this.main.changeModal('error', 'Usuario no encontrado')
      }
      if (response.status === 500) {
        this.main.changeModal('error', 'Error en el servidor')
      }
    });
  }

  cambiarEstadoActivo(usuario:any,estado:any){
    console.log(estado)
  }

  dataFiltrada(usuario:any) {
    return Object.entries(usuario)
      .filter(([key, value]) => !this.clavesExcluidas.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }


  guardarCambios(usuario:any) {
    this.usuariosServicio.actualizarUsuario(usuario.id, this.dataFiltrada(usuario)).subscribe((response) => {
      if (response.status === 200) {
        this.main.changeModal('success', 'Usuario actualizado correctamente')
      }
      if(response.status === 404) {
        this.main.changeModal('error', 'No se realizaron cambios porque el usuario no existe')
      }
      if(response.status === 500) {
        this.main.changeModal('error', 'Error en el servidor')
      }
    });
  }
}

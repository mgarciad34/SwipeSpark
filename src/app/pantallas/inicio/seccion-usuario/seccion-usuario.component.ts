import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/login.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/user';
import { catchError, of } from 'rxjs';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Preferencia } from '../../../models/preferencia';
import { PreferenciasService } from '../../../servicios/preferencias.service';
import { AppComponent } from '../../../app.component';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { ModalCambiarFotoComponent } from "../modal-cambiar-foto/modal-cambiar-foto.component";
import { ModalCambiarPassComponent } from '../modal-cambiar-pass/modal-cambiar-pass.component';

@Component({
    selector: 'app-seccion-usuario',
    standalone: true,
    templateUrl: './seccion-usuario.component.html',
    styleUrl: './seccion-usuario.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FooterComponent,
        RouterLink,
        FormsModule,
        ModalCambiarFotoComponent,
        ModalCambiarPassComponent
    ]
})
export class SeccionUsuarioComponent implements OnInit {
  loginService = inject(LoginService)
  constructor(
    private main:AppComponent,
    private preferenciasService: PreferenciasService,
    private usuarioService : UsuariosService
  ) {}
  router = inject(Router)
  usuario = signal({} as User)
  preferencias = signal([] as Preferencia[])
  cambio = signal(false)
  pantallaActual = signal('')
  modalPreferencias = signal(true)
  modalCambiarFoto = signal(false)
  modalCambiarPass = signal(false)
  clavesExcluidas = ["createdAt", "updatedAt", "id","amigo_amistades","amistades","inscripcioneseventos","rolID","mensajes","preferencia","contraseña","foto"]; // Claves a excluir
  ngOnInit(): void {
    this.obtenerUsuario()

  }

  obtenerUsuario(){
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      this.loginService.obtenerUsuario(user.id).pipe(
        catchError((error) => {
          console.error("error no se pudo obtener el usuario");
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
          return of(null);
        })
      ).subscribe((res: any) => {
        if (res && res.status === 200) {
          this.usuario.set(res.body);
          this.preferencias.set(this.usuario().preferencia)
        }
      });
    }
  }

  cambiandoValorModal(valor: boolean) {
    this.modalPreferencias.set(valor)
    this.modalCambiarFoto.set(!valor)
    this.modalCambiarPass.set(!valor)
  }

  cerrarAplicacion(): void{
      this.router.navigate(['/login'])
      this.loginService.cerrarAplicacion()
  }

  dataFiltrada() {
    return Object.entries(this.usuario())
      .filter(([key, value]) => !this.clavesExcluidas.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }


  guardarCambios() {

    for (const key in this.preferencias()) {
      if (this.preferencias()[key] === null) {
        this.main.changeModal('error', 'Faltan campos por llenar')
        return;
      }
    }

    this.preferenciasService.actualizarPreferenciasDelUsuario(this.preferencias(),this.usuario().id).subscribe((res: any) => {
      if (res.status === 200) {
        this.main.changeModal('success', 'Preferencias guardadas correctamente')
        this.obtenerUsuario()
        this.cambio.set(false)
      }
      if (res.status === 404) {
        this.main.changeModal('error', 'Error al guardar las preferencias')
      }
      if (res.status === 500) {
        this.main.changeModal('error', 'Error en el servidor')
      }
      } )

      this.usuarioService.actualizarUsuario(this.usuario().id, this.usuario()).subscribe((res: any) => {
        if (res.status === 200) {
          this.main.changeModal('success', 'Usuario actualizado correctamente')
          this.obtenerUsuario()
          this.cambio.set(false)
        }
        if (res.status === 404) {
          this.main.changeModal('error', 'Error al guardar las preferencias')
        }
        if (res.status === 500) {
          this.main.changeModal('error', 'Error en el servidor')
        }
        }
      )

  }



}



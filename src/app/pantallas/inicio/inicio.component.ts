import { User } from './../../models/user';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { LoginService } from '../../servicios/login.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { catchError, of } from 'rxjs';
import { ModalPreferenciasUsuarioComponent } from './modal-preferencias-usuario/modal-preferencias-usuario.component';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    ModalPreferenciasUsuarioComponent,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioComponent implements OnInit {
  loginService = inject(LoginService)
  router = inject(Router)
  usuario = signal({} as User)
  pantallaActual = signal('')
  modalPreferencias = signal(true)
  listo = signal(false)
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
          this.listo.set(true)
        }
      });
    }
  }

  cambiandoValorModal(valor: boolean) {
    this.modalPreferencias.set(valor)
  }

   cerrarAplicacion(): void{
      this.router.navigate(['/login'])
      this.loginService.cerrarAplicacion()
    }

}

import { Amistad } from './../../models/amistad';
import { User } from './../../models/user';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { LoginService } from '../../servicios/login.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { catchError, of } from 'rxjs';
import { ModalPreferenciasUsuarioComponent } from './modal-preferencias-usuario/modal-preferencias-usuario.component';
import { UsuariosService } from '../../servicios/usuarios.service';
import { AppComponent } from '../../app.component';
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

  constructor(private loginService: LoginService, private usuariosService: UsuariosService, private router:Router, private main: AppComponent) {}
  usuario = signal({} as User)
  pantallaActual = signal('')
  modalPreferencias = signal(true)
  recomendaciones = signal([])
  dislikes = signal([] as User[])
  solicitudesRecibidas = signal([] as User[])
  solicitudesEnviadas = signal([] as User[])
  actualRecomendacion = signal({foto:''} as User)
  actualDislike = signal({} as User)
  actualIndiceDislike = signal(0)
  actualIndiceLike = signal(0)
  listo = signal(false)
  cantidad = signal(5);
  pageSwipe = signal('Recomendaciones');
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
          this.obtenerRecomendaciones()
          this.asignarAmistades()
          this.listo.set(true)
        }
      });
    }
  }

  obtenerRecomendaciones(){
    const data = {
      preferencia : this.usuario().preferencia,
      omitir: [] as string[]
    }
    this.usuario().amistades.forEach((amistad:Amistad) => {
      data.omitir.push(amistad.amigoID!)
    } )

    this.usuariosService.obtenerRecomendaciones(this.usuario().id,this.cantidad(),data).subscribe((res) => {
      if(res.status === 200){
        this.recomendaciones.set(res.body)
        this.asignarRecomendacion()
      }
      if(res.status === 500){
        this.main.changeModal('error', 'Error al obtener las recomendaciones!');
        this.recomendaciones.set([])
      }
    });
  }

  asignarRecomendacion(){
    this.actualRecomendacion.set(this.recomendaciones()[0])
  }

  asignarAmistades() {
    const usuarioID = this.usuario().id;
    const amistades = this.usuario().amistades;

    const verificarAmistad = amistades.map(async (amistad: Amistad) => {

    });

  }

  cambiandoValorModal(valor: boolean) {
    this.modalPreferencias.set(valor)
  }

  cerrarAplicacion(): void{
      this.router.navigate(['/login'])
      this.loginService.cerrarAplicacion()
    }

  rotarLikePerfiles(opcion:string) {
      if(opcion === 'like'){
        const likePerfiles = document.getElementById('likePerfiles');
        if (likePerfiles) {
          likePerfiles.style.transform = 'rotate(5deg)';
        }
      }
      if(opcion === 'dislike'){
        const likePerfiles = document.getElementById('likePerfiles');
        if (likePerfiles) {
          likePerfiles.style.transform = 'rotate(-5deg)';
        }
      }
    }

  reiniciarLikePerfiles() {
      const likePerfiles = document.getElementById('likePerfiles');
      if (likePerfiles) {
        likePerfiles.style.transform = 'rotate(0deg)';
      }
    }

  like(){
    const data = {
      usuarioID: this.usuario().id,
      amigoID: this.actualRecomendacion().id
    }
    this.usuariosService.like(data).subscribe((res) => {
      if(res.status === 200){
        this.main.changeModal('success', 'Ahora hicieron match!');
        this.obtenerUsuario()
      }
      if(res.status === 201){
        this.main.changeModal('success', 'Solicitud de amistad enviada!');
        this.obtenerUsuario()
      }
      if(res.status === 400){
        this.main.changeModal('error', 'Ya existe una amistad entre los usuarios!');
        this.obtenerUsuario()
      }
      if(res.status === 500){
        this.main.changeModal('error', 'Error al realizar la acción!');
        this.obtenerUsuario()
      }
    });
  }

  dislike(){
    const data = {
      usuarioID: this.usuario().id,
      amigoID: this.actualRecomendacion().id
    }
    this.usuariosService.dislike(data).subscribe((res) => {
      if(res.status === 201){
        this.main.changeModal('success', 'Usuario omitido!');
        this.obtenerUsuario()
      }
      if(res.status === 200){
        this.main.changeModal('success', 'Solicitud de amistad rechazada!');
        this.obtenerUsuario()
      }
      if(res.status === 404){
        this.main.changeModal('error', 'No existe alguno de los dos usuarios!');
        this.obtenerUsuario()
      }
      if(res.status === 500){
        this.main.changeModal('error', 'Error al realizar la acción!');
        this.obtenerUsuario()
      }
    });
  }

}

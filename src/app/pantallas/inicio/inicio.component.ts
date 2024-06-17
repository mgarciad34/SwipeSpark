import { Amistad } from './../../models/amistad';
import { User } from './../../models/user';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, signal, type OnInit } from '@angular/core';
import { LoginService } from '../../servicios/login.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { catchError, of, Subscription } from 'rxjs';
import { ModalPreferenciasUsuarioComponent } from './modal-preferencias-usuario/modal-preferencias-usuario.component';
import { UsuariosService } from '../../servicios/usuarios.service';
import { AppComponent } from '../../app.component';
import { NotifyComponent } from '../../components/notify/notify.component';
import { MensajesService } from '../../servicios/mensajes.service';
import { Mensaje } from '../../models/mensaje';
import { ActivoComponent } from '../../components/activo/activo.component';
import { FormsModule } from '@angular/forms';
import { SHA256 } from 'crypto-js';
import { Evento } from '../../models/eventos';
import { EventosService } from '../../servicios/eventos.service';
import { ModalMapComponent } from './modal-map/modal-map.component';
import { mapaData } from '../../models/mapa';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    ModalPreferenciasUsuarioComponent,
    RouterOutlet,
    RouterLink,
    NotifyComponent,
    ActivoComponent,
    FormsModule,
    ModalMapComponent,
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioComponent implements OnInit {
  constructor(private loginService: LoginService, private usuariosService: UsuariosService, private router:Router, private main: AppComponent, private cdr: ChangeDetectorRef, private eventosService:EventosService, private mensajesService:MensajesService) {
      this.iniciarVerificacionPeriodica();
      this.socketSubscription = this.mensajesService.on('recibirMensaje').subscribe((mensaje) => {
        console.log('Mensaje recibido', mensaje);
        this.mensajesService.obtenerHistorialMensajes(this.usuario().id?.toString()!  , this.mdActivo().id?.toString()!  ).subscribe((mensajes) => {
          this.mensajes.set([]);
          this.mensajes.set(mensajes);
          this.cdr.detectChanges();
          this.cdr.markForCheck();
          const divMensajes = document.getElementById('mensajes');
          if (divMensajes) {
            divMensajes.scrollTop = divMensajes.scrollHeight;
          }
        } );
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      });
      this.anchoViewport = window.innerWidth;
  }
  anchoViewport!: number;
  usuario = signal({} as User)
  eventos = signal([] as Evento[])
  mensajes = signal([] as Mensaje[])
  pantallaActual = signal('')
  modalPreferencias = signal(true)
  recomendaciones = signal([])
  amigos = signal([] as User[])
  dislikes = signal([] as User[])
  idChatActual = signal('');
  reverseidChatActual = signal('')
  solicitudesRecibidas = signal([] as User[])
  solicitudesEnviadas = signal([] as User[])
  actualRecomendacion = signal({foto:''} as User)
  actualDislike = signal({} as User)
  actualSolicitud = signal({} as User)
  actualIndiceDislike = signal(0)
  actualIndiceLike = signal(0)
  actualIndiceSolicitud = signal(0)
  mdActivo = signal({} as User)
  usuarioEscribiendo = signal('')
  usuariosActivos = signal([] as unknown as {[key: string]: boolean})
  contenido = signal('')
  archivoAdjunto = signal(null)
  listo = signal(false)
  cantidad = signal(5);
  pageSwipe = signal('Recomendaciones');
  pageNav = signal('MD');
  modalMap = signal(false);
  dataMapa = signal([] as mapaData);
  socketSubscription!: Subscription;
  escribirSubscription!: Subscription;
  intervalId: any;

  ngOnInit(): void {
    this.obtenerUsuario();
    this.obtenerEventos();
    this.escribirSubscription = this.mensajesService.escribiendo().subscribe(data => {
      this.usuarioEscribiendo.set(data.nick);
      this.idChatActual.set(data.idChat);
      this.reverseidChatActual.set(data.reverseidChat);
      this.cdr.detectChanges();
      this.cdr.markForCheck();
      this.iniciarTemporizadorReseteo();
    });
  }

  iniciarVerificacionPeriodica(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.verificarAmigosActivos();
    }, 3000);
  }

  iniciarTemporizadorReseteo(): void {
    setTimeout(() => {
      this.usuarioEscribiendo.set('');
      this.cdr.detectChanges();
      this.cdr.markForCheck();
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }, 3000);
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
          this.mensajesService.conectar(res.body.nick!);
          this.asignarAmistades()
          this.obtenerRecomendaciones()
          this.listo.set(true)
          this.cdr.detectChanges();
          this.cdr.markForCheck();
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
      data.omitir.push(amistad.usuarioID!)
    } )

    this.usuario().amigo_amistades.forEach((amistad:Amistad) => {
      data.omitir.push(amistad.amigoID!)
      data.omitir.push(amistad.usuarioID!)
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
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  asignarDislike(){
    this.actualDislike.set(this.dislikes()[0])
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  asignarLike(){
    this.actualRecomendacion.set(this.recomendaciones()[0])
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  asignarSolicitud(){
    this.actualSolicitud.set(this.solicitudesRecibidas()[0])
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  siguienteDislike(){
    this.dislikes().push(this.dislikes().shift()!)
    this.asignarDislike()
  }

  siguienteLike(){
    this.solicitudesEnviadas().push(this.solicitudesEnviadas().shift()!)
    this.asignarLike()
  }

  anteriorDislike(){
    this.dislikes().unshift(this.dislikes().pop()!)
    this.asignarDislike()
  }

  anteriorLike(){
    this.solicitudesEnviadas().unshift(this.solicitudesEnviadas().pop()!)
    this.asignarLike()
  }

  siguienteSolicitud(){
    this.solicitudesRecibidas().push(this.solicitudesRecibidas().shift()!)
    this.asignarRecomendacion()
  }

  anteriorSolicitud(){
    this.solicitudesRecibidas().unshift(this.solicitudesRecibidas().pop()!)
    this.asignarRecomendacion()
  }

  asignarAmistades() {
    const usuarioID = this.usuario().id;
    const usuarioID_amistades = this.usuario().amistades;
    const amigo_amistades = this.usuario().amigo_amistades;
    const amistades = [...usuarioID_amistades, ...amigo_amistades]
    amistades.map(async (amistad: Amistad) => {

          if(amistad.estado === 'enviada'){
               if(amistad.usuarioID === usuarioID){
                    const solicitud = await this.usuariosService.obtenerUsuario(amistad.amigoID!).toPromise();
                    if(solicitud?.status === 200){
                         this.solicitudesEnviadas().push(solicitud.body);
                         this.asignarLike()
                         this.asignarDislike()
                    }else{
                         null
                    }
               }
               if(amistad.amigoID === usuarioID){
                    const solicitud = await this.usuariosService.obtenerUsuario(amistad.usuarioID!).toPromise();
                    if(solicitud?.status === 200){
                         this.solicitudesRecibidas().push(solicitud.body);
                         this.asignarLike()
                         this.asignarDislike()
                    }else{
                         null
                    }
               }
          }

          if(amistad.estado === 'rechazado'){
                if(amistad.usuarioID === usuarioID){
                    const dislike = await this.usuariosService.obtenerUsuario(amistad.amigoID!).toPromise();
                    if(dislike?.status === 200){
                         this.dislikes().push(dislike.body);
                         this.asignarLike()
                         this.asignarDislike()
                    }else{
                         null
                    }
                }
          }

          if(amistad.estado === 'match'){
                if(amistad.usuarioID === usuarioID){
                    const amigo = await this.usuariosService.obtenerUsuario(amistad.amigoID!).toPromise();
                    if(amigo?.status === 200){
                         this.amigos().push(amigo.body);
                         this.asignarLike()
                         this.asignarDislike()
                    }else{
                         null
                    }
                }
                if(amistad.amigoID === usuarioID){
                    const amigo = await this.usuariosService.obtenerUsuario(amistad.usuarioID!).toPromise();
                    if(amigo?.status === 200){
                         this.amigos().push(amigo.body);
                         this.asignarLike()
                         this.asignarDislike()
                    }else{
                         null
                    }
                }
          }

    });

  }

  cambiandoValorModal(valor: boolean) {
    this.modalPreferencias.set(valor)
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

  like(amigoID:any){
    const data = {
      usuarioID: this.usuario().id,
      amigoID: amigoID
    }
    this.usuariosService.like(data).subscribe((res) => {
      if(res.status === 200){
        this.main.changeModal('success', res.body.mensaje);
        this.vaciarTodo()
      }
      if(res.status === 201){
        this.main.changeModal('success', res.body.mensaje);
        this.vaciarTodo()
      }
      if(res.status === 400){
        this.main.changeModal('error', res.body.mensaje);
        this.vaciarTodo()
      }
      if(res.status === 500){
        this.main.changeModal('error', res.body.mensaje);
        this.vaciarTodo()
      }
    });
  }

  dislike(amigoID:any){
    const data = {
      usuarioID: this.usuario().id,
      amigoID: amigoID
    }
    this.usuariosService.dislike(data).subscribe((res) => {
      if(res.status === 201){
        this.main.changeModal('success', res.body.mensaje);
        this.vaciarTodo()
      }
      if(res.status === 200){
        this.main.changeModal('success', res.body.mensaje);
        this.vaciarTodo()
      }
      if(res.status === 404){
        this.main.changeModal('error', res.body.mensaje);
        this.vaciarTodo()
      }
      if(res.status === 500){
        this.main.changeModal('error', res.body.mensaje);
        this.vaciarTodo()
      }
    });
  }

  vaciarTodo(){
    this.solicitudesEnviadas.set([])
    this.solicitudesRecibidas.set([])
    this.amigos.set([])
    this.dislikes.set([])
    this.recomendaciones.set([])
    this.obtenerUsuario()
    this.cdr.detectChanges();
    this.cdr.markForCheck();
}

  abrirChat(remitenteID:any, receptorID:any,mdAactivo:any){
    this.contenido.set('')
    this.archivoAdjunto.set(null)
    this.mdActivo.set(mdAactivo)
    this.pageNav.set('MensajeDirecto')
    this.mensajesService.unirseAlChat(remitenteID, receptorID)
    this.mensajesService.obtenerHistorialMensajes(remitenteID, receptorID).subscribe((mensajes) => {
      this.mensajes.set(mensajes)
      this.cdr.detectChanges();
      this.cdr.markForCheck();
      const divMensajes = document.getElementById('mensajes');
      if (divMensajes) {
        divMensajes.scrollTop = divMensajes.scrollHeight;
      }
    } )

  }

  notificarEscribiendo(nick: string, remitenteID: string, receptorID: string) {
    this.mensajesService.notificarEscribiendo(nick, remitenteID, receptorID);
  }

  verificarUsuariosActivos(userNicks: string[]) {
    this.mensajesService.verificarUsuariosActivos(userNicks).subscribe(result => {
      this.usuariosActivos.set(result);
    });
  }

  verificarAmigosActivos() {
    const userNicks = this.amigos().map((amigo) => amigo.nick!);
    this.verificarUsuariosActivos(userNicks);
  }

  usuarioEstaActivo(nick: string) {
    return this.usuariosActivos()[nick];
  }

  obtenerTamanoUsuariosActivos(): number {
    const usuarios = this.usuariosActivos();
    let contador = 0;
    for (const key in usuarios) {
      if (usuarios[key] === true) {
        contador++;
      }
    }
    return contador;
  }

  enviarMensaje(mensaje: string, remitenteID: string, receptorID: string, ficheroAdjunt: any) {
    if(!mensaje || mensaje === '' || mensaje === ' ' )return
    const mensajeObj = {
      remitenteID,
      receptorID,
      contenido: mensaje,
      fechaEnvio: new Date().toISOString(),
      ficheroAdjunt: ficheroAdjunt
    };
    this.mensajesService.enviarMensaje(mensajeObj)
    const divMensajes = document.getElementById('mensajes');
    if (divMensajes) {
      divMensajes.scrollTop = divMensajes.scrollHeight;
      this.limpiarInput()
    }
  }

  abrirMensajeLikeEnviado(){
    this.abrirChat(this.usuario().id, this.solicitudesEnviadas()[this.actualIndiceLike()].id, this.solicitudesEnviadas()[this.actualIndiceLike()])
  }

  limpiarInput(){
    this.contenido.set('')
    this.archivoAdjunto.set(null)
  }

  cerrarAplicacion(): void{
    this.router.navigate(['/login'])
    this.loginService.cerrarAplicacion()
    this.mensajesService.desconectar()
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleString();
  }

  compararIdChat(remitenteId: string, receptorId: string): boolean {
    const idChatAcomparar = this.calcularIdChat(remitenteId, receptorId);
    const inversoAcomparar = this.calcularIdChat(receptorId, remitenteId);

    if(this.idChatActual() === idChatAcomparar || this.idChatActual() === inversoAcomparar ||
       this.reverseidChatActual() === idChatAcomparar || this.reverseidChatActual() === inversoAcomparar) {

        return true;
    } else {

        return false;
    }
}

  refrescar() {
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  calcularIdChat(remitenteID: string, receptorID: string): string {
    const combinedIDs = remitenteID + receptorID;
    return SHA256(combinedIDs).toString();
  }

  obtenerEventos(){
     this.eventos.set([])
     this.eventosService.obtenerEventos().subscribe((res) => {
          if(res.status === 200){
               this.eventos.set(res.body)
               console.log(this.eventos())
          }
          if(res.status === 500){
               this.main.changeModal('error', 'Error al obtener los eventos!');
               this.eventos.set([])
          }

     });
  }

  toggleEvento(usuarioId:any, eventoId:any){

     this.eventos().forEach((evento:Evento) => {
          if(evento.id === eventoId){

               if(evento.inscripcioneseventos!.length === 0 || evento.inscripcioneseventos!.length === undefined || evento.inscripcioneseventos!.length === null){
                    if(this.cerraronInscripciones(eventoId)){
                         console.log("no")
                         this.main.changeModal('error', 'Cerradas inscripciones!');
                         return
                     }
                    this.eventosService.inscribirseAEvento(usuarioId, eventoId).subscribe((res) => {
                         if(res.status === 201){
                              this.main.changeModal('success', 'Inscrito al evento correctamente!');
                              this.obtenerEventos()
                         }
                         if(res.status === 404){
                              this.main.changeModal('error', 'Ya estas inscrito al evento!');
                         }
                         if(res.status === 500){
                              this.main.changeModal('error', 'Error al inscribirse al evento!');
                         }
                    });
               }else{
                    evento.inscripcioneseventos?.forEach((inscripcion:any) => {
                         if(inscripcion.usuarioID === usuarioId){
                              this.eventosService.desinscribirseAEvento(usuarioId, eventoId).subscribe((res) => {
                                   if(res.status === 200){
                                        this.main.changeModal('success', 'Desinscrito del evento correctamente!');
                                        this.obtenerEventos()
                                   }
                                   if(res.status === 500){
                                        this.main.changeModal('error', 'Error al desinscribirse al evento!');
                                   }
                              });
                         }else{
                              if(this.cerraronInscripciones(eventoId)){
                                   console.log("no")
                                   this.main.changeModal('error', 'Cerradas inscripciones!');
                                   return
                               }
                              this.eventosService.inscribirseAEvento(usuarioId, eventoId).subscribe((res) => {
                                   if(res.status === 201){
                                        this.main.changeModal('success', 'Inscrito al evento correctamente!');
                                        this.obtenerEventos()
                                   }
                                   if(res.status === 500){
                                        this.main.changeModal('error', 'Error al inscribirse al evento!');
                                   }
                              });
                         }
                    } )
               }

          }
     })
  }

  seEncuentraEnElEvento(usuarioId:any, eventoId:any){
     let inscrito = false
     this.eventos().forEach((evento:Evento) => {
          if(evento.id === eventoId){
               if(evento.inscripcioneseventos!.length === 0 || evento.inscripcioneseventos!.length === undefined || evento.inscripcioneseventos!.length === null){
                    inscrito = false
               }else{
                    evento.inscripcioneseventos?.forEach((inscripcion:any) => {
                         if(inscripcion.usuarioID === usuarioId){
                              inscrito = true
                         }
                    } )
               }
          }
     })
     return inscrito
  }

  cerraronInscripciones(eventoId: any): boolean {
     let cerrado = false;
     this.eventos().forEach((evento: Evento) => {
       if (evento.id === eventoId) {
         const fechaCierreInscripcion = new Date(evento.fechaCierreInscripcion!);
         const fechaActual = new Date();
         if (fechaCierreInscripcion < fechaActual) {
           cerrado = true;
         }
       }
     });
     return cerrado;
   }

   cambiandoValorModalMap($event:boolean){
     this.modalMap.set($event)
   }

   alistandoElMapa(abierto:boolean, evento:Evento){
     console.log(abierto)
     console.log(evento)
     const dataMapa = {
          nombre: evento.nombre,
          latitud: evento.geolocalizacion?.split(',')[0],
          longitud: evento.geolocalizacion?.split(',')[1]
     }
     this.dataMapa.set(dataMapa)
     this.modalMap.set(abierto)
   }



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
     this.anchoViewport = event.target.innerWidth;
     if (this.anchoViewport > 768) {
       this.pantallaActual.set('')
     } else {
       this.pantallaActual.set('Swipe')
     }
   }


  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    if (this.escribirSubscription) {
      this.escribirSubscription.unsubscribe();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

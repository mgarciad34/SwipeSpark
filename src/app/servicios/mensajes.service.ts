import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { Mensaje } from '../models/mensaje';
import { environment } from '../../environments/environment';
import { SHA256 } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  private serverUrl = `${environment.apiSocket}`;
  private socket: Socket;
  private escribiendoSub = new Subject<any>();
  private intervaloDeActividadDeUsuario: any;
  private mensajeSubject: Subject<Mensaje> = new Subject<Mensaje>();

  constructor() {
    this.socket = io(this.serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de Socket.io');
    });
    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor de Socket.io');
    });

    this.socket.on('usuarioEscribiendo', (data: { nick: string, idChat:any, reverseidChat:any }) => {
      this.escribiendoSub.next(data);
    });
  }

  on(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  obtenerHistorialMensajes(remitenteID: string, receptorID: string): Observable<Mensaje[]> {
    return new Observable<Mensaje[]>(observer => {
      this.socket.emit('obtenerHistorialMensajes', { remitenteID, receptorID });
      this.socket.on('historialMensajes', (historial: Mensaje[]) => {
        observer.next(historial);
      });
    });
  }

  enviarMensaje(mensaje: Mensaje) {
    const idChat = this.calcularIdChat(mensaje.remitenteID, mensaje.receptorID);
    mensaje.idChat = idChat;
    this.socket.emit('sendMessage', mensaje);
  }

  recibirMensaje(): Observable<Mensaje> {
    return new Observable(observer => {
      this.socket.on('recibirMensaje', (mensaje: Mensaje) => {
        observer.next(mensaje);
      });
    });
  }

  notificarEscribiendo(nick: string, remitenteID: string, receptorID: string) {
    const idChat = this.calcularIdChat(remitenteID, receptorID);
    const reverseidChat = this.calcularIdChat(receptorID, remitenteID);
    this.socket.emit('escribiendo', { nick, idChat,reverseidChat });
  }

  escribiendo(): Observable<any> {
    return this.escribiendoSub.asObservable();
  }

  conectar(usuarioNick: string) {
    this.empezarLatidos(usuarioNick);
  }

  desconectar() {
    this.socket.disconnect();
    this.pararLatidos();
  }

  unirseAlChat(remitenteID: string, receptorID: string) {
    const idChat = this.calcularIdChat(remitenteID, receptorID);
    this.socket.emit('entrarChat', idChat);
  }

  private calcularIdChat(remitenteID: string, receptorID: string): string {
    const combinedIDs = remitenteID + receptorID;
    return SHA256(combinedIDs).toString();
  }

  private empezarLatidos(userID: string) {
    this.intervaloDeActividadDeUsuario = setInterval(() => {
      this.socket.emit('usuarioActivo', userID);
    }, 5000);
  }

  private pararLatidos() {
    clearInterval(this.intervaloDeActividadDeUsuario);
  }

  verificarUsuariosActivos(userNicks: string[]): Observable<{ [key: string]: boolean }> {
    return new Observable<{ [key: string]: boolean }>(observer => {
      this.socket.emit('verificarUsuariosActivos', userNicks, (result: { [key: string]: boolean }) => {
        observer.next(result);
      });
    });
  }

  obtenerTotalUsuariosActivos(): Observable<number> {
    return new Observable<number>(observer => {
      this.socket.emit('obtenerTotalDeUsuariosActivos', (total: number) => {
        observer.next(total);
      });
    });
  }
}

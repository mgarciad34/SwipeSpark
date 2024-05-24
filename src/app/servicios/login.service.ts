import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  login(data: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.url, data, { observe: 'response' });
  }

  obtenerUsuario(id: any): Observable<HttpResponse<any>> {
      return this.http.get<any>(`${environment.apiUrl}/usuario/${id}`, { observe: 'response' });
  }

  cerrarAplicacion(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
  }

  verificarExpiracionToken(token: string): boolean {
    // Decodificar el token para acceder al payload
    const decodedToken: any = jwtDecode(token);

    // Obtener la fecha de expiración del token en segundos
    const expiracion: number = decodedToken.exp;

    // Obtener la fecha actual en segundos
    const fechaActual: number = Math.floor(Date.now() / 1000);

    // Verificar si la fecha de expiración es mayor que la fecha actual
    // Si la fecha de expiración es menor o igual a la fecha actual, el token ha expirado
    return expiracion > fechaActual;
  }

  verificarTiempoExpiraciónToken(token: string): number {
    // Decodificar el token para acceder al payload
    const decodedToken: any = jwtDecode(token);

    // Obtener la fecha de expiración del token en segundos
    const expiracion: number = decodedToken.exp;

    // Obtener la fecha actual en segundos
    const fechaActual: number = Math.floor(Date.now() / 1000);

    // Obtener el tiempo restante de expiración del token en horas,minutos y segundos
    const tiempoRestante: number = expiracion - fechaActual;

    return tiempoRestante;
  }



}

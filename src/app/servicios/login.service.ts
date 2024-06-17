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
    const decodedToken: any = jwtDecode(token);
    const expiracion: number = decodedToken.exp;
    const fechaActual: number = Math.floor(Date.now() / 1000);
    return expiracion > fechaActual;
  }

  verificarTiempoExpiraciónToken(token: string): number {
    const decodedToken: any = jwtDecode(token);
    const expiracion: number = decodedToken.exp;
    const fechaActual: number = Math.floor(Date.now() / 1000);
    const tiempoRestante: number = expiracion - fechaActual;

    return tiempoRestante;
  }



}

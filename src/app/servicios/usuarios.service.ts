import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private urlUsuarios = `${environment.apiUrl}/usuarios`;
  private urlUsuario = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(this.urlUsuarios, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  obtenerUsuario(id: any): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.urlUsuario}/${id}`, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  actualizarUsuario(id: any, data: any): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.urlUsuario}/${id}`, data, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  eliminarUsuario(id: any): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>(`${this.urlUsuario}/${id}`, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  obtenerRecomendaciones(
    id: any,
    cantidad: any,
    data: any
  ): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${this.urlUsuarios}/recomendaciones/${cantidad}/${id}`,
      data,
      { observe: 'response' }
    );
  }

  cambiarContraseña(id: any, data: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.urlUsuario}/pass/${id}`, data, {
      observe: 'response',
    });
  }

  like(data: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.urlUsuario}/like`, data, {
      observe: 'response',
    });
  }

  dislike(data: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.urlUsuario}/dislike`, data, {
      observe: 'response',
    });
  }

  verificarAmistad(data: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.urlUsuario}/verificarAmistad`, data, {
      observe: 'response',
    });
  }

  compararContraseñas(plainPassword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreferenciasService {
  private urlPreferencia = `${environment.apiUrl}/preferencia`;
  private urlPreferencias = `${environment.apiUrl}/preferencias`;

  constructor(private http: HttpClient) {}

  crearPreferenciaDelUsuario(
    data: any,
    id: any
  ): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(`${this.urlPreferencia}/${id}`, data, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  crearPreferenciasDelUsuario(
    data: any,
    id: any
  ): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(`${this.urlPreferencias}/${id}`, data, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  obtenerPreferenciasDelUsuario(id: any): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.urlPreferencia}/${id}`, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  actualizarPreferenciaDelUsuario(
    data: any,
    id: any
  ): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.urlPreferencia}/${id}`, data, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  actualizarPreferenciasDelUsuario(
    data: any,
    id: any
  ): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.urlPreferencias}/${id}`, data, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  eliminarPreferenciaDelUsuario(id: any): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>(`${this.urlPreferencia}/${id}`, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  eliminarPreferenciasDelUsuario(id: any): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>(`${this.urlPreferencias}/${id}`, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  private urlCrearEvento = `${environment.apiUrl}/crear/evento`;
  private urlEventos = `${environment.apiUrl}/eventos`;
  private urlEvento = `${environment.apiUrl}/evento`;

  constructor(private http: HttpClient) {}

  obtenerEventos(): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.urlEventos, { observe: 'response' });
  }

  obtenerEvento(id: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.urlEvento}/${id}`, {
      observe: 'response',
    });
  }

  crearEvento(id: any, data: any): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(this.urlCrearEvento, data, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  actualizarEvento(id: any, data: any): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.urlEvento}/${id}`, data, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  eliminarEvento(id: any): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>(`${this.urlEvento}/${id}`, {
      observe: 'response',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}

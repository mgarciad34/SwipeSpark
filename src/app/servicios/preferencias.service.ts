import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferenciasService {
  private urlPreferencia = `${environment.apiUrl}/preferencia`;
  private urlPreferencias = `${environment.apiUrl}/preferencias`;
  constructor(private http: HttpClient) {}


  crearPreferenciaDelUsuario(data: any, id:any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.urlPreferencia}/${id}`, data, { observe: 'response' });
  }

  crearPreferenciasDelUsuario(data: any, id:any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.urlPreferencias}/${id}`, data, { observe: 'response' });
  }

  obtenerPreferenciasDelUsuario(id:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.urlPreferencia}/${id}`, { observe: 'response' });
  }

  actualizarPreferenciaDelUsuario(data: any, id:any): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.urlPreferencia}/${id}`, data, { observe: 'response' });
  }

  actualizarPreferenciasDelUsuario(data: any, id:any): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.urlPreferencias}/${id}`, data, { observe: 'response' });
  }

  eliminarPreferenciaDelUsuario(id:any): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.urlPreferencia}/${id}`, { observe: 'response' });
  }

  eliminarPreferenciasDelUsuario(id:any): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.urlPreferencias}/${id}`, { observe: 'response' });
  }

}

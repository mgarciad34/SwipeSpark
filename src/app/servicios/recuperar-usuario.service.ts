import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperarUsuarioService {
  private url = `${environment.apiUrl}/recuperar`;

  constructor(private http: HttpClient) {}

  recuperar(email: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.url, email, { observe: 'response' });
  }

}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private url = `${environment.apiUrl}/registrar`;

  constructor(private http: HttpClient) {}

  crearRegistro(registro: FormData): Observable<HttpResponse<any>> {

    var json: { [key: string]: any } = {};
    registro.forEach(function (value, key) {
        json[key] = value
    }
    );
    return this.http.post(this.url, json, { observe: 'response' });
  }
}

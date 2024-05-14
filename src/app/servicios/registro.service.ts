import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private url = 'localhost:9090/api/registrar';

  constructor(private http: HttpClient) {}

  crearRegistro(registro: FormData): Observable<any> {
    return this.http.post(this.url, registro);
  }
}

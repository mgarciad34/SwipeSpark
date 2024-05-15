import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private url = 'http://localhost:9090/api/registrar';

  constructor(private http: HttpClient) {}

  crearRegistro(registro: FormData): Observable<any> {

    var json: { [key: string]: any } = {};
    registro.forEach(function (value, key) {
        json[key] = value
    }
    );
    console.log(json);
    return this.http.post(this.url, json);
  }
}

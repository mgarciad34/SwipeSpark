import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecuperarUsuarioService } from '../../servicios/recuperar-usuario.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.css'
})
export class RecuperarComponent {
  email = signal('');
  constructor(private recuperarServicio: RecuperarUsuarioService, private main: AppComponent) {}

  recuperar() {
    if(this.email() === '' || this.email() === undefined){
      this.main.changeModal('error', 'Por favor, ingrese un correo');
      return;
    }else{
      if(!this.email().includes('@') || !this.email().includes('.')){
        this.main.changeModal('error', 'Por favor, ingrese un correo válido');
        return;
      }else{
        let body= {
          Email: this.email()
        }
        this.recuperarServicio.recuperar(body).subscribe((response) => {
          if(response.status === 200){
            this.main.changeModal('success', 'Correo enviado');
          }
        });
      }
    }
  }
}
